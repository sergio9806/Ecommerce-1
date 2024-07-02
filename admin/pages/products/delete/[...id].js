import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage() {
    const [productInfo, setProductInfo] = useState();
    const router = useRouter();
    const { id } = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/products?id=' + id).then(response => {
            setProductInfo(response.data);
        })
    }, [id])
    //go back to Product lobby
    function goBack() {
        router.push('/Products')
    }
    async function deleteProduct() {
        await axios.delete('/api/products?id=' + id);
        goBack();
    }
    return (
        <Layout>
            <h1 className="text-center">¿Realmente quiere aliminar &nbsp; "{productInfo?.title}"?</h1>
            <div className="flex gap-2 justify-center">
                <button className="btn-red" onClick={deleteProduct}>Si</button>
                <button className="btn-defult" onClick={goBack}>No</button>
            </div>

        </Layout>
    );

}