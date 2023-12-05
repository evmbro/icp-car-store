import {
  Canister,
  Opt,
  Record,
  StableBTreeMap,
  Vec,
  Void,
  bool,
  int,
  query,
  text,
  update,
} from "azle";
import { v4 as uuidv4 } from "uuid";

// Define the Car structure
const Car = Record({
  id: text,
  make: text,
  model: text,
  year: int,
  price: int,
  description: text,
  image_url: text,
  is_available: bool,
  owner_email: text,
});

type Car = typeof Car;

// Initialize the car storage
let carStorage = StableBTreeMap(text, Car, 0);

export default Canister({
  // Create a new car listing
  createCarListing: update(
    [text, text, int, int, text, text],
    text,
    (make, model, year, price, description, image_url) => {
      let car: Car = {
        id: uuidv4(),
        make: make,
        model: model,
        year: year,
        price: price,
        description: description,
        image_url: image_url,
        is_available: true,
        owner_email: "", // This can be set based on user context or a separate function
      };
      carStorage.insert(car.id, car);
      return car.id;
    }
  ),

  // Update an existing car listing
  updateCarListing: update(
    [text, text, text, int, int, text, text, bool],
    text,
    (id, make, model, year, price, description, image_url, is_available) => {
      let carOpt = carStorage.get(id);
      if ("None" in carOpt) {
        throw new Error("Car not exist");
      }

      let car: Car = carOpt.Some;
      car.make = make;
      car.model = model;
      car.year = year;
      car.price = price;
      car.description = description;
      car.image_url = image_url;
      car.is_available = is_available;
      carStorage.insert(car.id, car);
      return car.id;
    }
  ),

  // Toggle the availability of a car listing
  toggleCarAvailability: update([text], Void, (id) => {
    let carOpt = carStorage.get(id);
    if ("None" in carOpt) {
      throw new Error("Car not exist");
    }

    let car: Car = carOpt.Some;
    car.is_available = !car.is_available;
    carStorage.insert(car.id, car);
  }),

  // Retrieve all car listings
  getCarListings: query([], Vec(Car), () => {
    return carStorage.values();
  }),

  // Retrieve a car listing by ID
  getCarById: query([text], Opt(Car), (id) => {
    return carStorage.get(id);
  }),
});
