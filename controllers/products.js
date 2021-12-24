const Product = require('../models/product')

//this is just a testing route static values
const getAllProductsStatic = async (req,res)=>{
    //from monogoose docs how to filter
    const products = await Product.find({price:{$gt:30}})
    .sort('-name')
    .select()
    .limit(4)
    .skip(3)
    //throw new Error('testing async error')
    res.status(200).json({products})
}

const getAllProducts = async (req, res) => {
    //the values in a re the ones i want them to be able to filter
    const {feature, company,name,sort,select,numfilter}=req.query
    const queryObject={}
    if(feature){
        queryObject.feature = feature === 'true'? true : false
    }
    if(company){
        queryObject.company = company
    }
    if(name){
        queryObject.name= {$regex:name , $options: 'i'}
    }

    if(numfilter){
        const operatorMap={
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            ',':'$lt',
            '<=':'$lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filter = numfilter.replace(regEx,(match)=>`-${operatorMap[match]}-`)
        const options = ['price','rating']
        filter = filter.split(',').forEach((item)=>{
            const [field,operator,value] = item.split('-')
            if(options.includes(field)){
                queryObject[field]={[operator]:Number(value)}
            }
        })
    }
  let result = Product.find(queryObject)
  if(sort){
      const sortList = sort.split(',').join(' ')
      result =result.sort(sortList)
  }
  else{
      result = result.sort('creatAt')
  }
  if(select){
      const selectList = select.split(',').join(' ')
      result = result.select(selectList)  
  }
  const page = Number(req.query.page) || 1
  const limit=Number(req.query.limit)||20
  const skip=(page-1)*limit
  result =result.skip(skip).limit(limit)

  const products= await result
  res.status(200).json({products, Hits:products.length});
};

module.exports = {
    getAllProductsStatic,
    getAllProducts,
}


/* this was the initial setup to make sure things woked, the above is adding different functionality
const getAllProductsStatic = async (req,res)=>{
    //throw new Error('testing async error')
    res.status(200).json({msg: 'product testing'})
}

const getAllProducts = async (req, res) => {
  res.status(200).json({ msg: "product testing" });
};

module.exports = {
    getAllProductsStatic,
    getAllProducts,
}*/