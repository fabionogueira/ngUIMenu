(function(){
    var FtDOMService, FtPopupService;
    
    /**
     * @directive ngFtMenu
     * @dependecies FtDOM, FtPopup
     * @description 
     *      
     * @example
     *      
     */
    angular.module('ngFront').directive('ngFtMenu', ngFtMenuDirective);
    ngFtMenuDirective.$inject = ['FtDOM', 'FtPopup', 'FtMenu'];
    function ngFtMenuDirective(FtDOM, FtPopup, FtMenu){
        
        FtDOMService = FtDOM;
        
        return {
            restrict: 'A',
            link: function(scope, $element, attr) {
                //define o elemento como popup
                FtPopup(attr.ngFtMenu)
                    .init($element, {
                        enableCancelHidePopup: false,
                        cls: 'ft-menu'
                    });
                
                $element.on('click', onClick);
                
                scope.$on('destroy', function(){
                    $element.off('click', onClick);
                });
                
                function onClick($event){
                    return;
                    
                    if (!$event.target.getAttribute('ng-menu')){
                        var $e= FtDOM.closet($event.target, 'li'),
                            o = $element._options;
                        
                        if ($e){
                            FtMenu($element._menu_id).hide();
                            if (o.onitem){
                                o.onitem($e.attr('data-item'), $e);
                            }
                        }
                    }
                }
            }
        };
    }
    
    /**
     * @service FtMenu
     */
    angular.module('ngFront').service('FtMenu', FtMenuService);
    FtMenuService.$$inject = ['FtPopup'];
    function FtMenuService(FtPopup){
        FtPopupService = FtPopup;
        
        return function(id){
            return {
                show: function(options){
                    FtMenuService.$$menus[id] = true;
                    FtPopup(id).show(options);
                },
                hide: function(options){
                    FtMenuService.$$menus[id] = false;
                    FtPopup(id).hide(options);
                }
            };
        };
        
    };
    FtMenuService.$$menus = {};
    FtMenuService.hide = function(id, fn){
        if (FtMenuService.$$menus[id]){
            FtMenuService(FtPopupService)(id).hide(fn);
        }
    };
    
    function closeAllMenus(){
        var key, arr, service;
        
        if (FtPopupService){
            service = FtMenuService(FtPopupService);
            arr = [];
            
            for (key in FtMenuService.$$menus){
                arr.push(key);
            }
            
            for (key=0; key<arr.length; key++){
                service(arr[key]).hide();
            }
        }
    }
    
    angular.element(document).on('mousedown', function($event){
        
        //se tem menu sendo exibido
        if (Object.keys(FtMenuService.$$menus).length>0){
            
            //se o evento não foi sobre um menu
            if (!FtDOMService.closet($event.target, '[ng-ft-menu]')){
                closeAllMenus();
            }
        }
        
    });
   
    
}());
