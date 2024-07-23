import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "./spinner";
import { ReactSortable } from "react-sortablejs";


export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category:assignedCategory,
    properties:assignedProperties,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [category,setCategory] = useState(assignedCategory || '');
    const [productProperties, setProductProperties] = useState(assignedProperties|| {});
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();
    const [categories, setCategories] = useState([])
    useEffect(()=>{
        axios.get('/api/categories').then(result =>{
           setCategories(result.data);
        })
    },[])

    async function saveProduct(ev) {
        ev.preventDefault();

        const data = { title, description, price, images, category,
            properties:productProperties,};
        if (_id) {
            //update 
            await axios.put('/api/products', { ...data, _id });

        } else {
            //create 
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }

    if (goToProducts) {
        router.push('/products')
    }
    //subir fotos

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
        
    }
    function updateImagesOrder (images){
        setImages(images);
      }
    
      function setProductProp(propName,value){
        setProductProperties(prev => {
            const newProductsProps = {...prev};
            newProductsProps[propName] = value;
            return newProductsProps;
        })
      }

      const propertiesToFill =[];
      if(categories.length > 0 &&category){
        let catInfo = categories.find(({_id}) => _id === category);
         propertiesToFill.push(...catInfo.properties);
         while(catInfo?.parent?._id){
            const parentCat = categories.find(({_id}) => _id === catInfo );
            propertiesToFill.push(...parentCat.properties);
            catInfo= parentCat;
         }
    }
    return (

        <form className="p-4" onSubmit={saveProduct}>

            <label>Nombre Producto</label>
            <input type="text" placeholder="Nombre del producto"
                value={title} onChange={ev => setTitle(ev.target.value)} />
           <label>Categoría</label> 
           <select value={category} onChange={ev => setCategory(ev.target.value)}>
            <option value="">Sin categoría</option>
           {categories.length > 0 && categories.map(c=>(
            <option value={c._id}>{c.name}</option>
           ))}
           </select>
           
            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
             <div className="flex gap-1">
                <div>{p.name}</div>
                <select value={productProperties[p.name]} onChange={ev => setProductProp(p.name, ev.target.value)}>
                    {p.values.map(v => (
                        <option value={v}>{v}</option>
                    ))}
                </select>
                </div>   
            ))}

            <label>Fotos</label>
            <div className="mb-2 flex flex-wrap gap-1">
            <ReactSortable list={images} 
                className="flex flex-wrap gap-1"
                setList={updateImagesOrder}>
                {!!images?.length && images.map(link => (
                    <div key={link} className="h-24">
                        <img src={link} alt="" className="rounded-lg" />
                    </div>
                ))}
                </ReactSortable >
                {isUploading && (
                    <div className="h-24 p-1  flex items-center">
                        <Spinner />
                    </div>
                )}
                <label className=" w-24 h-24  text-center flex flex-col items-center cursor-pointer
                justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>
                        Cargar
                    </div>
                    <input type="file" onChange={uploadImages} className="hidden"></input>
                </label>

            </div>
            <label>Descripción</label>
            <textarea placeholder="Descripción" value={description} onChange={ev => setDescription(ev.target.value)} />
            <label>Precio (Colones)</label>
            <input type="number" placeholder="Precio" value={price} onChange={ev => setPrice(ev.target.value)} />
            <button type="submit" className="btn-primary">Guardar</button>
        </form>



    );
}