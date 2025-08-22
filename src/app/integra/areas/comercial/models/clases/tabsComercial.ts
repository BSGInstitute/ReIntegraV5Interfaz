export class TabComercial{
    indexTab: number;
    idTab: number;
    nombreTab: string;
    titleTab: string;
    toggleFiltro: boolean;
    selected: boolean;
    disabled: boolean;
    
    constructor(nombreTab: string, titleTab: string, idTab?: number){
        this.idTab = idTab;
        this.nombreTab = nombreTab;
        this.titleTab = titleTab;
        this.toggleFiltro = false;
        this.selected = false;
        this.disabled = false;
    }
}