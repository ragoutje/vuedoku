# Vuedoku
A simple Sudoku implementation using VueJS3, Typescript and ViteJS.

## Prequisites
- npm >= v10.*
- nodejs >= v20.*

## Installation
```bash
npm install
```
Install Husky locally:
```bash
npm run prepare
```

## Usage
Run a dev environment:
```bash
npm run dev
```
Run linter and prettier:
```bash
npm run lint:fix
```

## Deploy
Make sure to test npm run build before trying to deploy.
If everything runs normally just commit. Husky will lint-staged before committing.
Push code to remote.
A Github workflow is set up to always deploy using Github Actions and Github Pages when a commit enters the main branch.

## Wishlist
- Unit tests
- Clean up VueJS code