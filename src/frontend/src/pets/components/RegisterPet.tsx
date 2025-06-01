import { usePetStore } from '../store/usePetStore';
import { useForm } from 'react-hook-form';
import { Pet } from 'pets/types/Pet';
import Error from './Error';
import { fileToCanisterBinaryStoreFormat } from '../utils/image';

type FormData = {
    name: string;
    age: number;
}

export default function RegisterPet() {
    const { registerPet, selectedImage, handleImageDrop } = usePetStore();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

    const registerPetHandler = async (data: FormData) => {
        console.log("Iniciando registro de mascota...");
        console.log("Datos recibidos:", data);
        console.log("Imagen seleccionada:", selectedImage);
        
        try {
            let imageData = "";
            if (selectedImage) {
                console.log("Procesando imagen...");
                const fileArray = await fileToCanisterBinaryStoreFormat(selectedImage);
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
            alert("Error al registrar mascota");
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
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
                        {...register('name', {
                            required: 'El nombre de la mascota es obligatorio'
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
                        placeholder="Edad de la Mascota"
                        {...register('age', {
                            required: 'La edad de la mascota es obligatoria',
                            min: {
                                value: 0,
                                message: 'La edad debe ser mayor o igual a 0'
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
                        accept="image/png,image/jpeg"
                        onChange={handleFileChange}
                    />
                    {selectedImage && (
                        <p className="text-sm text-green-600 mt-2">
                            📷 {selectedImage.name}
                        </p>
                    )}
                </div>

                <input
                    type="submit"
                    className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-indigo-700 cursor-pointer transition-colors rounded-md"
                    value='Registrar Mascota'
                />
            </form>
        </div>
    );
}