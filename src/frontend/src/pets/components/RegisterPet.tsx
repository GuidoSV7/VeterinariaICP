// RegisterPet.tsx - Versión mejorada con compresión automática
import { usePetStore } from '../store/usePetStore';
import { useForm } from 'react-hook-form';
import { Pet } from 'pets/types/Pet';
import Error from './Error';
import { fileToCanisterBinaryStoreFormat, resizeImage } from '../utils/image';

type FormData = {
    name: string;
    age: number;
}

export default function RegisterPet() {
    const { registerPet, selectedImage, handleImageDrop, isLoading } = usePetStore();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

    const registerPetHandler = async (data: FormData) => {
        console.log("Iniciando registro de mascota...");
        console.log("Datos recibidos:", data);
        console.log("Imagen seleccionada:", selectedImage);
        
        try {
            let imageData = "";
            if (selectedImage) {
                console.log("Procesando imagen...");
                
                // Comprimir imagen antes de procesar
                let processedImage = selectedImage;
                if (selectedImage.size > 500000) { // Si es mayor a 500KB
                    console.log("Imagen grande detectada, comprimiendo...");
                    processedImage = await resizeImage(selectedImage, 1024); // Redimensionar a máximo 1024px
                    console.log(`Imagen comprimida: ${selectedImage.size} bytes → ${processedImage.size} bytes`);
                }
                
                const fileArray = await fileToCanisterBinaryStoreFormat(processedImage);
                imageData = JSON.stringify(fileArray);
                console.log("Imagen procesada:", imageData.substring(0, 100) + "...");
            }

            console.log("Enviando datos al store...");
            await registerPet({
                name: data.name,
                age: BigInt(data.age),
                image: imageData
            });
            console.log("Mascota registrada exitosamente");
            reset();
            alert("Mascota registrada exitosamente");
        } catch (error) {
            console.error("Error registrando mascota:", error);
            
        }
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                alert('Por favor selecciona solo archivos de imagen');
                return;
            }
            
            // Validar tamaño máximo (ej: 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('La imagen es demasiado grande. Máximo 10MB permitido.');
                return;
            }
            
            handleImageDrop(file);
        }
    };

    return (
        <div className="w-full px-5">
            <h2 className="font-black text-3xl text-center">Seguimiento Mascotas</h2>

            <p className="text-lg mt-5 text-center mb-10">
                Añade Mascotas y {''}
                <span className="text-indigo-600 font-bold">Administralos</span>
            </p>

            <form 
                className="bg-white shadow-md rounded-lg py-10 px-5 mb-10"
                onSubmit={handleSubmit(registerPetHandler)}
                noValidate
            >
                <div className="mb-5">
                    <label htmlFor="name" className="text-sm uppercase font-bold">
                        Nombre de la Mascota
                    </label>
                    <input  
                        id="name"
                        className="w-full p-3 mt-2 border border-gray-300 rounded-md"  
                        type="text" 
                        placeholder="Nombre de la Mascota"
                        disabled={isLoading}
                        {...register('name', {
                            required: 'El nombre de la mascota es obligatorio',
                            minLength: {
                                value: 2,
                                message: 'El nombre debe tener al menos 2 caracteres'
                            }
                        })} 
                    />
                    {errors.name && (
                        <Error>
                            {errors.name?.message}
                        </Error>
                    )}
                </div>

                <div className="mb-5">
                    <label htmlFor="age" className="text-sm uppercase font-bold">
                        Edad de la Mascota
                    </label>
                    <input  
                        id="age"
                        className="w-full p-3 mt-2 border border-gray-300 rounded-md"  
                        type="number" 
                        min="0"
                        max="50"
                        placeholder="Edad de la Mascota"
                        disabled={isLoading}
                        {...register('age', {
                            required: 'La edad de la mascota es obligatoria',
                            min: {
                                value: 0,
                                message: 'La edad debe ser mayor o igual a 0'
                            },
                            max: {
                                value: 50,
                                message: 'La edad debe ser menor a 50 años'
                            }
                        })} 
                    />
                    {errors.age && (
                        <Error>
                            {errors.age?.message}
                        </Error>
                    )}
                </div>

                <div className="mb-5">
                    <label htmlFor="image" className="text-sm uppercase font-bold">
                        Foto de la Mascota (Opcional)
                    </label>
                    <input
                        type="file"
                        id="image"
                        className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleFileChange}
                        disabled={isLoading}
                    />
                    {selectedImage && (
                        <div className="mt-2">
                            <p className="text-sm text-green-600">
                                📷 {selectedImage.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                Tamaño: {(selectedImage.size / 1024).toFixed(1)} KB
                                {selectedImage.size > 500000 && (
                                    <span className="text-blue-600 ml-2">
                                        (Se comprimirá automáticamente)
                                    </span>
                                )}
                            </p>
                        </div>
                    )}
                </div>

                <input
                    type="submit"
                    className={`w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded-md ${
                        isLoading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                    value={isLoading ? 'Registrando...' : 'Registrar Mascota'}
                    disabled={isLoading}
                />
            </form>
        </div>
    );
}