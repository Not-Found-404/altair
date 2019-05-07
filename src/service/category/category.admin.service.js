import {CategoryCommonService} from "./category.common.service";

export class CategoryAdminService extends CategoryCommonService {
    /**
     * 創建店铺类目
     * @param request 参数
     */
    create = (request) => {
        console.log('創建店铺类目');
        this.get({
            url: '/api/admin/shop/category/create',
            request: request
        });
    };

    /**
     * 修改店铺类目
     * @param request
     */
    update = (request) => {
        console.log('修改店铺类目');
        this.get({
            url: '/api/admin/shop/category/update',
            request: request
        });
    };
}
