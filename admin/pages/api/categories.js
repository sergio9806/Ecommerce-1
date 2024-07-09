import { Category } from "@/models/Category";
import {mongooseConnect} from "@/lib/mongoose";

export default async function handle(req, res){
    const {method} = req;
    await mongooseConnect();
    if (method === 'GET'){
       res.json(await Category.find().populate('parent'));
    }

    if (method === 'POST') {
        const {name,parentCategory} = req.body;
     const CategoryDoc = await  Category.create({name,parent:parentCategory || null,});
     res.json(CategoryDoc)
    }
    if (method === 'PUT') {
        const {name,parentCategory  ,_id} = req.body;
     const CategoryDoc = await  Category.updateOne({_id},{name,parent:parentCategory || null ,});
     res.json(CategoryDoc)
    }
    if (method === 'DELETE') {
        const {_id} = req.query;
      await Category.deleteOne({_id});
      res.json('ok');
    }
}