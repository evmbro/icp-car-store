import {
  $query,
  $update,
  Record,
  StableBTreeMap,
  Vec,
  Result,
  nat64,
  ic,
  Opt,
  match,
  nat,
} from "azle";
import { v4 as uuidv4 } from "uuid";

type Car = Record<{
  id: string;
  make: string;
  model: string;
  year: nat;
  price: nat;
  description: string;
  image_url: string;
  is_available: boolean;
  owner_email: string;
  createdAt: nat64;
  updatedAt: Opt<nat64>;
}>;

type CarPayload = Record<{
  make: string;
  model: string;
  year: nat64;
  price: nat64;
  description: string;
  image_url: string;
  is_available: boolean;
  owner_email: string;
  // Add other fields as needed
}>;

let carStorage = new StableBTreeMap<string, Car>(0, 44, 1024);

/**
 * Create a new car listing.
 * @param payload Car details to create a listing.
 * @returns Result containing the created car or an error message.
 */
$update
export function createCarListing(payload: CarPayload): Result<Car, string> {
  try {
    // Validate payload properties
    if (!payload.make || !payload.model || payload.year <= 0 || payload.price < 0) {
      throw new Error("Invalid payload properties");
    }

    let car: Car = {
      id: uuidv4(),
      createdAt: ic.time(),
      updatedAt: Opt.None,
      // Set each property explicitly
      make: payload.make,
      model: payload.model,
      year: payload.year,
      price: payload.price,
      description: payload.description || "", // Set a default value
      image_url: payload.image_url || "", // Set a default value
      is_available: payload.is_available,
      owner_email: payload.owner_email,
    };

    // Insert the car into storage
    carStorage.insert(car.id, car);

    return Result.Ok<Car, string>(car);
  } catch (error) {
    return Result.Err<Car, string>(`Failed to create car listing: ${error}`);
  }
}

/**
 * Update an existing car listing.
 * @param id ID of the car listing to update.
 * @param payload Updated car details.
 * @returns Result containing the updated car or an error message.
 */
$update
export function updateCarListing(id: string, payload: CarPayload): Result<Car, string> {
  try {
    // Validate payload properties
    if (!payload.make || !payload.model || payload.year <= 0 || payload.price < 0) {
      throw new Error("Invalid payload properties");
    }

    return match(carStorage.get(id), {
      Some: (existingCar) => {
        try {
          const updatedCar: Car = {
            ...existingCar,
            // Set each property explicitly
            make: payload.make,
            model: payload.model,
            year: payload.year,
            price: payload.price,
            description: payload.description || "", // Set a default value
            image_url: payload.image_url || "", // Set a default value
            is_available: payload.is_available,
            owner_email: payload.owner_email,
          };

          // Insert the updated car into storage
          carStorage.insert(updatedCar.id, updatedCar);

          return Result.Ok<Car, string>(updatedCar);
        } catch (updateError) {
          throw new Error(`Failed to update car listing: ${updateError}`);
        }
      },
      None: () => Result.Err<Car, string>(`Car with ID=${id} not found.`),
    });
  } catch (error) {
    return Result.Err<Car, string>(`Failed to update car listing: ${error}`);
  }
}

/**
 * Toggle the availability of a car listing.
 * @param id ID of the car listing to toggle availability.
 * @returns Result containing a success message or an error message.
 */
$update
export function toggleCarAvailability(id: string): Result<string, string> {
  try {
    // Validate payload properties
    if (!id) {
      return Result.Err<string, string>("Invalid Id");
    }

    return match(carStorage.get(id), {
      Some: (existingCar) => {
        try {
          const updatedCar: Car = {
            ...existingCar,
            is_available: !existingCar.is_available,
          };

          // Insert the updated car into storage
          carStorage.insert(updatedCar.id, updatedCar);

          return Result.Ok<string, string>("True");
        } catch (updateError) {
          throw new Error(`Failed to toggle car availability: ${updateError}`);
        }
      },
      None: () => Result.Err<string, string>(`Car with ID=${id} not found.`),
    });
  } catch (error) {
    return Result.Err<string, string>(`Failed to toggle car availability: ${error}`);
  }
}

/**
 * Get a list of all car listings.
 * @returns Result containing a list of cars or an error message.
 */
$query
export function getCarListings(): Result<Vec<Car>, string> {
  try {
    return Result.Ok(carStorage.values());
  } catch (error) {
    return Result.Err('Failed to retrieve car listings');
  }
}

/**
 * Get a car listing by ID.
 * @param id ID of the car listing to retrieve.
 * @returns Result containing the requested car or an error message.
 */
$query
export function getCarById(id: string): Result<Car, string> {
  try {
    // Validate payload properties
    if (!id) {
      return Result.Err<Car, string>("Invalid Id");
    }

    return match(carStorage.get(id), {
      Some: (car) => Result.Ok<Car, string>(car),
      None: () => Result.Err<Car, string>(`Car with ID=${id} not found.`),
    });
  } catch (error) {
    return Result.Err<Car, string>(`Failed to retrieve car by ID: ${error}`);
  }
}

// a workaround to make uuid package work with Azle
globalThis.crypto = {
  // @ts-ignore
  getRandomValues: () => {
    let array = new Uint8Array(32);
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  },
};
