export class Personal {
  private  personalDTO: any;

  constructor(personal: any){
    this.personalDTO;
  }

  es_coordinador () {
      if (this.personalDTO.tipo_personal === "Coordinador" || this.personalDTO.id === 3759 || this.personalDTO.id === 4081)
          return true;
      return false;
  };

  es_asesor() {
      if (this.personalDTO.tipo_personal === "Asesor")
          return true;
      return false;
  };

  getId() {
      return this.personalDTO.id;
  };

  getSubordinados () {
      return this.personalDTO.subordinados;
  };

  getNombreCompleto() {
      return this.personalDTO.nombres + " " + this.personalDTO.apellidos;
  };


}
