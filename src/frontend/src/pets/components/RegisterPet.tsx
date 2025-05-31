import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePetStore } from '../store/usePetStore';
import {useForm} from 'react-hook-form';
import { Pet } from 'pets/types/Pet';

export default function RegisterPet() {
    const registerPet = usePetStore(state => state.registerPet);

    const {register, handleSubmit, setValue,  formState:{errors}, reset} = useForm<Pet>(); 

    const registerPetHandler = (data: Pet) => {
        registerPet(data);
        reset();
        alert("Mascota registrada exitosamente");
    }

    return (
        <h1 className=''>Registrar Mascota</h1>
    )
   
};

