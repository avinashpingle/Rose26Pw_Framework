import NoSuchUrlError from "./errors/NoSuchUrlError";
export class Sample {
    myFunction() {
        throw new NoSuchUrlError();
    }
}
let s = new Sample();
s.myFunction();
