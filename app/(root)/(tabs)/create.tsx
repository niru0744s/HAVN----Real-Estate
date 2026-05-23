import { useSupabase } from "@/hooks/useSupabase";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

    const TYPES = ["apartment","house","villa","studio"] as const;
    type PropertyType = (typeof TYPES)[number];

    const MIN_PRICE =1;
    const MAX_PRICE = 999_999_999;

    interface FormState {

    title: string,
    description: string,
    price: number,
    type: PropertyType,
    bedrooms: number,
    bathrooms: number,
    areaSqft: number,
    address: string,
    city: string,
    latitude: string,
    longitude: string,
    images: string[],
    isFeatured: boolean,
    localImages: string[],
};

const INITIAL_FORM: FormState = {
    title: "",
    description: "",
    price: 1,
    type: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    areaSqft: 1,
    address: "",
    city: "",
    latitude: "",
    longitude: "",
    images: [],
    isFeatured: false,
    localImages: [],
};

export default function Create() {
    const router = useRouter();
    const authSupabase = useSupabase();

    const [form, setForm] = useState<FormState>(INITIAL_FORM);

    const [submitting, setSubmitting] = useState(false);
    const [uploadImages, setUploadImages] = useState(false);
    const [deletingLocation, setDeletingLocation] = useState(false);

    const updateForm = (fields: Partial<FormState>) =>
        setForm((prev) => ({...prev, ...fields}));

    const handlePickImages = async () =>{
        const permission = await ImagePicker.getMediaLibraryPermissionsAsync();
        if(!permission.granted){
            Alert.alert(
                "Permission Required",
                "Please allow access to your photo library."
            );

            return;
        };

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsMultipleSelection: true,
            quality: 0.7,
            base64: true,
            selectionLimit: 6,
        });

        if(result.canceled) return;

        setUploadImages(true);
        const uploadUrls: string[] = [];
        const previrwUris: string[] = [];

        for(const asset of result.assets) {
            try {
                const filename = `property_${Date.now()}_${Math.random()
                .toString(36)
                .slice(2)}.jpg`;

                const base64 = asset.base64!;
                const buffer = Uint8Array.from(atob(base64),(c) => c.charCodeAt(0));

                const {error} = await authSupabase.storage
                .from("property.images")
                .upload(filename, buffer,{
                    contentType: "image/jpeg",
                    upsert: false,
                });

                if(error) throw error;

                const {data: urlData} = authSupabase.storage
                .from("property-images")
                .getPublicUrl(filename);

                uploadUrls.push(urlData.publicUrl);
                previrwUris.push(asset.uri);
            } catch (error) {
                console.error("Upload error:",error);
                Alert.alert(
                    "Upload Failed",
                    "One or more images failed to upload.",
                );
            }
        };

        updateForm({
            images: [...form.images, ...uploadUrls],
            localImages: [...form.localImages, ...previrwUris],
        });

        setUploadImages(false);
    };

    const handleRemoveImage = (index: number) => {
        updateForm({
            images: form.images.filter((_, i) => i !== index),
            localImages: form.localImages.filter((_,i)=> i !== index),
        });
    };

    const handleDetectLocation = async () => {
        setDeletingLocation(true);

        try {
            const {status} = await Location.requestForegroundPermissionsAsync();

            if(status !== "granted"){
                Alert.alert(
                    "Permission Denied",
                    "Location permission is required to detect coordinates.",
                );
                return;
            };

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            updateForm({
                latitude: String(location.coords.latitude),
                longitude: String(location.coords.longitude),
            });
        } catch (error) {
            Alert.alert("Error","Could not detect location. Enter manually.");
        } finally {
            setDeletingLocation(false);
        };
    };

    const handleSUbmit = async ()=>{
        if(!form.title.trim())
            return Alert.alert("Validate","Title is required.");

        if(!form.price)
            return Alert.alert("Validate","Price is required.");

        const priceNum = form.price;
        if(isNaN(priceNum) || priceNum < MIN_PRICE)
            return Alert.alert("Validation","Price must be greater that 0");
        if(priceNum > MAX_PRICE)
            return Alert.alert(
        "Validation",
        `Price cannot exceed ${MAX_PRICE.toLocaleString("en-IN")}.`,
        );

        if(!form.address.trim())
            return Alert.alert("Validation","Adress is required.");
        if(!form.city.trim())
            return Alert.alert("Validation","City is required.");
        if(form.images.length === 0)
            return Alert.alert(
        "Validation",
        "Please upload at least one image.",
    );
    setSubmitting(true);

    const {error} = await authSupabase.from("properties").insert({
    title: form.title.trim(),
    description: form.description.trim(),
    price: priceNum,
    type: form.type,
    bedrooms: form.bedrooms,
    bathrooms: form.bathrooms,
    area_sqft: form.areaSqft ? Number(form.areaSqft) : null,
    address: form.address.trim(),
    city: form.city.trim(),
    latitude: form.latitude ? Number(form.latitude) : null,
    longitude: form.longitude ? Number(form.longitude) : null,
    images: form.images,
    is_featured: form.isFeatured,
    is_sold:false,
    });

    setSubmitting(false);
    if(error){
        Alert.alert("Error","Failed to create property. Please try again.");
        console.error(error);
        return;
    };

    setForm(INITIAL_FORM);

    Alert.alert("Success","Property listed successfully.",[
        {text:"ok", onPress: ()=> router.replace("/(root)/(tabs)") },
    ]);
    };

    return (
        <SafeAreaView>
            <KeyboardAvoidingView>

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}