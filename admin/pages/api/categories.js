import { Category } from "@/models/Category";
import {mongooseConnect} from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]"

export default async function handle(req, res){
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req,res);


    if (method === 'GET'){
       res.json(await Category.find().populate('parent'));
    }

    if (method === 'POST') {
        const {name,parentCategory,properties} = req.body;
     const CategoryDoc = await  Category.create({name,parent:parentCategory || undefined,properties,});
     res.json(CategoryDoc)
    }
    if (method === 'PUT') {
        const {name,parentCategory  ,_id,properties} = req.body;
     const CategoryDoc = await  Category.updateOne({_id},{name,parent:parentCategory || undefined ,properties,});
     res.json(CategoryDoc)
    }
    if (method === 'DELETE') {
        const {_id} = req.query;
      await Category.deleteOne({_id});
      res.json('ok');
    }
}