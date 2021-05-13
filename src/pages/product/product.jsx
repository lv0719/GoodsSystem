import React, {Component} from 'react';
import ProductAdd from './components/productAdd';
import ProductHome from './components/productHome';
import ProductDetail from './components/productDetail';
import { Redirect ,Route,Switch} from "react-router-dom/cjs/react-router-dom.min";
import './product.less'
/*该界面为商品界面*/
export default class Product extends Component{
    render(){
        return(
            <Switch>
                <Route path="/product" component={ProductHome} exact/>
                <Route path="/product/add" component={ProductAdd}/>
                <Route path="/product/detail" component={ProductDetail}/>
                <Redirect to="/product"/>
            </Switch>
            
        )
    }
}