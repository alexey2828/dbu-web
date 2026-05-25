import React from 'react';
import {directoryModals} from "../../../../Infrastructure/const/modalNames";
import {productAPI} from "../../../../Infrastructure/services/ProductServices/ProductService";
import DirectoryPage from "../../../../Pages/directoryPage/directoryPage";
import {ProductTableHeader, ProductTableHeaderForReports} from "../../const/ProductHeader";
import {reportsAPI} from "../../../../Infrastructure/services/ReportsServices/ReportsService";

const ProductDirectory = () => {

    const {data} = productAPI.useFetchAllProductsQuery('')
    const [deleteProduct, {isError}] = productAPI.useDeleteProductMutation()
    return (
       /* <DirectoryPage data={data} headers={ProductTableHeader} deleteItem={deleteProduct} modalName={directoryModals.product}/>*/
<></>
    );
};

export default ProductDirectory;