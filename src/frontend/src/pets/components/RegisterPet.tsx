
import { usePetStore } from '../store/usePetStore';
import {useForm} from 'react-hook-form';
import { Pet } from 'pets/types/Pet';
import Error from './Error';


export default function RegisterPet() {
    const registerPet = usePetStore(state => state.registerPet);
    

    const {register, handleSubmit, formState:{errors}, reset} = useForm<Pet>(); 

    const registerPetHandler = (data: Pet) => {
        registerPet({
            name: data.name,
            age: BigInt(data.age)
            
        });
        reset();
        alert("Mascota registrada exitosamente");
    }

    return (
        <div className="w-full px-5">
            <h2 className="font-black text-3xl text-center">Seguimiento Mascotas</h2>

            <p className="text-lg mt-5 text-center mb-10">
                Añade Mascotas y {''}
                <span className="text-indigo-600 font-bold">Administralos</span>
            </p>

            <form 
                className="bg-white shadow-md rounded-lg py-10 px-5 mb-10"
                noValidate
                onSubmit={handleSubmit(registerPetHandler)}
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

                <input
                    type="submit"
                    className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-indigo-700 cursor-pointer transition-colors rounded-md"
                    value='Registrar Mascota'
                />
            </form> 
        </div>
    );
}

