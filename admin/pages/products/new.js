import Layout from "@/components/Layout";
import { Axios } from "axios";
import { useState } from "react";


export default function NewProduct() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    async function createProduct() {
        const data = {title,description,price};
       await Axios.post('api/products', data);
       
    }
    return (
        <Layout>
            <form onSubmit={createProduct}>
                <h1>Nuevo producto</h1>
                <label>Nombre Producto</label>
                <input type="text" placeholder="Nombre del producto"
                    value={title} onChange={ev => setTitle(ev.target.value)} />
                <label>Descripción</label>
                <textarea placeholder="Descripción" value={description} onChange={ev => setDescription(ev.target.value)} />
                <label>Precio (Colones)</label>
                <input type="number" placeholder="Precio" value={price} onChange={ev => setPrice(ev.target.value)} />
                <button type="submit" className="btn-primary">Guardar</button>
            </form>

            
        </Layout>
    );
}