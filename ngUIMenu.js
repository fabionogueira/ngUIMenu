/**
 * @directive ngUIMenu
 * @dependecies ngUI, ngPopup
 * @version 1.0.0
 * @description 
 *      
 * @example
 *      
 */

(function(){
    
    angular.module('ngUI').directive('ngUiMenu', [
                '$ui','$popup',
        function($ui,  $popup){
            return {
                restrict: 'A',
                link: function($scope, $element, attr) {
                    var self;
                    
                    self = {
                        show: function(options){
                            $element[0].$$options = options;
                            $popup.show($element, options, $element.children()[0]);
                        },
                        hide: function(){
                            delete($element[0].$$options);
                            $popup.hide($element);
                        }
                    };
                    
                    $popup.create($element, attr.ngUiMenu);                    
                    $ui.register($scope, self, $element, attr.ngUiMenu);
                    
                    $element.on('click', onClick);
                    $scope.$on('destroy', function(){
                        $element.off('click', onClick);
                    });

                    function onClick($event){
                        var o, $e= $ui.DOM.closet($event.target, 'li');
                        
                        //se o click foi em um item do menu
                        if ($e && $event.target.getAttribute('type')!=='text'){
                            var o = $element[0].$$options;

                            self.hide();
                            
                            if ( o && o.onItemClick){
                                o.onItemClick($e.attr('data-item'), $e);
                            }
                            
                        }
                        //se o click foi fora do menu
                        else if ($event.target.getAttribute('ng-ui-menu')){
                            self.hide();
                        }
                    }
                }
            };

        }]);
    
    
}());
