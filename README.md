# ICP-Car-Store

This project is a canister that leverages the Internet Computer Protocol (ICP) and the Azle framework. It is designed to manage a digital storefront for car sales, allowing users to create, view, update, and toggle the availability of car listings.

## Key Components

- **Car**: Represents a car listing with details such as make, model, year, price, description, and availability.
- **carStorage**: Utilizes `StableBTreeMap` for stable storage, ensuring persistence of car listings across system updates.

## Features

- **createCarListing**: Allows users to add new car listings to the store.
- **updateCarListing**: Enables users to update existing car listings.
- **toggleCarAvailability**: Provides the functionality to change the availability status of a car listing.
- **getCarListings**: Fetches all car listings available in the store.
- **getCarById**: Retrieves details of a specific car listing by its ID.

## Interaction

Users can interact with the canister through its public methods. The application supports both creation and modification of car listings, as well as querying for specific cars or all available listings.

## Purpose

The provided code snippet serves an educational purpose, demonstrating how to build and manage a digital car storefront on the ICP using the Azle framework.

## How to run the project

- Clone the repository

```bash
git clone https://github.com/evmbro/icp-car-store.git
```

- Install dependencies

```bash
npm install
```

- Start DFX (More about the flags can be found [here](https://internetcomputer.org/docs/current/references/cli-reference/dfx-start#flags))

```bash
dfx start --background --clean
```

- Deploy canister

```bash
dfx deploy
```

After deployment, you will receive a message indicating the successful deployment of your canisters, including URLs for interacting with your backend canister through the Candid interface.

- Stop DFX when done

```bash
dfx stop
```

# Use cases

Interaction with the canister can be done through the **Candid interface** or using the command line with the commands below.

## Create a new car listing

```bash
dfx canister call car_store createCarListing '(record {"make"="Tesla"; "model"="Model S"; "year"=2021; "price"=80000; "description"="Latest model with autopilot"; "image_url"="http://example.com/car.jpg"})'
```

## Update an existing car listing

```bash
dfx canister call car_store updateCarListing '(record {"id"="car_id"; "make"="Tesla"; "model"="Model S"; "year"=2021; "price"=79000; "description"="Latest model, price reduced"; "image_url"="http://example.com/car_updated.jpg"; "is_available"=true})'
```

## Toggle the availability of a car listing

```bash
dfx canister call car_store toggleCarAvailability '("car_id")'
```

## Retrieve all car listings

```bash
dfx canister call car_store getCarListings
```

## Retrieve a specific car listing by ID

```bash
dfx canister call car_store getCarById '("car_id")'
```
