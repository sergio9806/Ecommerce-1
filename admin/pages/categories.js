import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';


function Categories({swal}) {

    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, [])

    function fetchCategories() {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }
    //guardar categoría 
    async function saveCategory(ev) {
        ev.preventDefault();
        const data = { name,parentCategory: parentCategory || null }
        if (editedCategory) {
            data._id = editedCategory._id ;
            await axios.put('api/categories',data );
            setEditedCategory(null);
        }else{
              axios.post('api/categories',data );
       
        }
       setName('');
        fetchCategories();
    }
   function editCategory(category){
       setEditedCategory(category);
       setName(category.name);
       setParentCategory(category.parent ? category.parent._id : '');
   }
   function deleteCategory(category){
    swal.fire({
        title: '¿Estás seguro?',
        text: `Deseas eliminar ${category.name} de tu lista de categorías? `,
        showCancelButton : true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, Eliminar',
        reverseButtons:true,
        confirmButtonColor:'#d55',
    }).then(async result => {
       if( result.isConfirmed){
        const {_id} = category
       await axios.delete('/api/categories?_id='+_id);
       fetchCategories();
       }
    }).catch(error => {
        // when promise rejected...
    });
   }
    return (
        <Layout>
            <h1>Categorias</h1>
            <label>{editedCategory? `Editar Categoría ${editedCategory.name}`: 'Nueva categoría' }</label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input className="mb-0" type="text" placeholder={'Category name'}
                    onChange={ev => setName(ev.target.value)}
                    value={name} />
                <select className="mb-0" onChange={ev => setParentCategory(ev.target.value)} value={parentCategory}>
                    <option value={0}>No parent category</option>
                    {categories.length > 0 && categories.map(category => (
                        <option value={category._id}>{category.name}</option>
                    ))}
                </select>
                <button type="submit" className="btn-primary py-1 ">Save</button>
            </form>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category name</td>
                        <td>parent category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(category => (
                        <tr>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td>
                                
                                    <button onClick={()=> editCategory(category)} className="btn-primary mr-1">Editar</button>
                                    <button 
                                    onClick={()=> deleteCategory(category)}
                                    className="btn-primary">
                                        Eliminar
                                        </button>
                                

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>

    );
}

export default  withSwal(({swal}, ref) => (
    <Categories swal={swal}/>
));