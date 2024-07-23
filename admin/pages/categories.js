import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';


function Categories({ swal }) {

    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);
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
        const data = { 
            name,
            parentCategory: parentCategory || null,
             properties: properties.map(p=> ({
                name:p.name, 
                values:p.values.split(','),
            })),
            }
        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put('api/categories', data);
            setEditedCategory(null);
        } else {
            axios.post('api/categories', data);

        }
        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }
    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent ? category.parent._id : '');
        setProperties(category.properties.map(({name,values}) => ({name,values:values.join(',')}) ));
    }
    function deleteCategory(category) {
        swal.fire({
            title: '¿Estás seguro?',
            text: `Deseas eliminar ${category.name} de tu lista de categorías? `,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, Eliminar',
            reverseButtons: true,
            confirmButtonColor: '#d55',
        }).then(async result => {
            if (result.isConfirmed) {
                const { _id } = category
                await axios.delete('/api/categories?_id=' + _id);
                fetchCategories();
            }
        }).catch(error => {
            // when promise rejected...
        });
    }
    function addProperty() {
        setProperties(prev => {
            return [...prev, { name: '', values: '' }]
        })
    }
    function handlePropertyNameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }
    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
    }
    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            })
        });
    }

    return (
        <Layout>
            <h1>Categorias</h1>
            <label>{editedCategory ? `Editar Categoría ${editedCategory.name}` : 'Nueva categoría'}</label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input type="text" placeholder={'Category name'}
                        onChange={ev => setName(ev.target.value)}
                        value={name} />
                    <select onChange={ev => setParentCategory(ev.target.value)} value={parentCategory}>
                        <option value={0}>No parent category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option value={category._id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block">Propiedades</label>
                    <button type="button" onClick={addProperty} className="btn-default text-sm mb-2">Añadir propiedades</button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div className="flex gap-1 mb-2">
                            <input type="text" className="mb-0" value={property.name} onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                                placeholder="nombre propiedad,ejemplo(color)" />
                            <input type="text" className="mb-0" value={property.values} placeholder="values, comma separates" onChange={ev => handlePropertyValuesChange(index, property, ev.target.value)} />
                            <button type="button" className="btn-default" onClick={() => removeProperty(index)}>Eliminar</button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                    {editedCategory && (
                        <button type="button" onClick={()=> {setEditedCategory(null);setName(''); setParentCategory('');setProperties([]);}} className="btn-default">Cancelar</button>
                    )}

                    <button type="submit" className="btn-primary py-1 ">Guardar</button>

                </div>

            </form>
            {!editedCategory && (
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

                                    <button onClick={() => editCategory(category)} className="btn-primary mr-1">Editar</button>
                                    <button
                                        onClick={() => deleteCategory(category)}
                                        className="btn-primary">
                                        Eliminar
                                    </button>


                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>



            )}

        </Layout>

    );
}

export default withSwal(({ swal }, ref) => (
    <Categories swal={swal} />
));