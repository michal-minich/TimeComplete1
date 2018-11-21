import { IWindow } from "../interfaces";


export class Window implements IWindow {


    showBelow(content: HTMLElement, el: HTMLElement): void {
        /* const  clickCoords = getPosition(e);
         const clickCoordsX = clickCoords.x;
         const clickCoordsY = clickCoords.y;
 
         const menuWidth = menu.offsetWidth + 4;
         const menuHeight = menu.offsetHeight + 4;
 
         const windowWidth = window.innerWidth;
         const windowHeight = window.innerHeight;
 
         if ( (windowWidth - clickCoordsX) < menuWidth ) {
             menu.style.left = windowWidth - menuWidth + "px";
         } else {
             menu.style.left = clickCoordsX + "px";
         }
 
         if ( (windowHeight - clickCoordsY) < menuHeight ) {
             menu.style.top = windowHeight - menuHeight + "px";
         } else {
             menu.style.top = clickCoordsY + "px";
         }
         */
    }


    hide(): void {


    }
}