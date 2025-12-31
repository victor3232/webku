export const PRODUCTS = [
  { id: "1gb",  name: "1GB",  ram: 1048,  disk: 1048, cpu: 30,  price: 1000,  egg: 15, loc: 1 },
  { id: "2gb",  name: "2GB",  ram: 2048,  disk: 2048, cpu: 60,  price: 1500,  egg: 15, loc: 1 },
  { id: "3gb",  name: "3GB",  ram: 3048,  disk: 3048, cpu: 90,  price: 2000,  egg: 15, loc: 1 },
  { id: "4gb",  name: "4GB",  ram: 4048,  disk: 4048, cpu: 100, price: 2500,  egg: 15, loc: 1 },
  { id: "5gb",  name: "5GB",  ram: 5048,  disk: 5048, cpu: 120, price: 3000,  egg: 15, loc: 1 },
  { id: "6gb",  name: "6GB",  ram: 6048,  disk: 6048, cpu: 140, price: 3500,  egg: 15, loc: 1 },
  { id: "7gb",  name: "7GB",  ram: 7048,  disk: 7048, cpu: 160, price: 4000,  egg: 15, loc: 1 },
  { id: "8gb",  name: "8GB",  ram: 8048,  disk: 8048, cpu: 180, price: 4500,  egg: 15, loc: 1 },
  { id: "9gb",  name: "9GB",  ram: 9048,  disk: 9048, cpu: 200, price: 5000,  egg: 15, loc: 1 },
  { id: "10gb", name: "10GB", ram: 10048, disk: 10048, cpu: 220, price: 5500, egg: 15, loc: 1 },
  { id: "unlimited", name: "[ PROMO ] Unlimited", ram: 0, disk: 0, cpu: 999, price: 4000, egg: 15, loc: 1 }
];

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id);
}
