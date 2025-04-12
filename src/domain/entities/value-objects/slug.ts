export class Slug {

  public value: string

  constructor(value: string){
    this.value = value
  }

  /**
   * receives a string and normalize it as a slug
   * 
   * Exemple "An example title" => "an-exemple-title"
   * 
   * @param text {string}
   */
  
  static createFromText(text: string){

  }
}