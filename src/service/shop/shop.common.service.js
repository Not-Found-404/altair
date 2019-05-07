import {AbstractService} from "../abstract.service";

export class ShopCommonService extends AbstractService {
    /**
     * 店铺分页
     */
    shopPaging = (request) => {
        this.get({
            url: '/api/common/shop/paging',
            request: request
        })
    };


    /**
     * 店铺前台类目查看
     * @param request
     */
    shopCategoryLis = (request) => {
        this.get({
            url: '/api/common/shop/category/list',
            request: request
        })
    }
}
