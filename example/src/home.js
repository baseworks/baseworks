export class Test {
  constructor() {
    this.message = "Home"
    this.input = "Input"
    console.log('Home ViewModel')
    this.message = {"test": "Awesome", "testa": "Better"}
    this.test = {"test": {"sub": "Tester"}}
    this.testTwo= {"test": {"test": {"sub": "deep"}}}
    this.testStrigng = "test";


  }

  callme(v) {
    console.log(v)
    console.log('ok')
    return v
  }


}
