import { clients, contacts, products, showrooms } from "@/data/catalog";
import type { Client, ContactPerson, Product, ShowroomBundle } from "@/types/catalog";

export interface CatalogRepository {
  getProducts(): Promise<Product[]>;
  getClient(id: string): Promise<Client | null>;
  getContact(id: string): Promise<ContactPerson | null>;
  getShowroomBySlug(slug: string): Promise<ShowroomBundle | null>;
}

class LocalCatalogRepository implements CatalogRepository {
  async getProducts() {
    return products;
  }

  async getClient(id: string) {
    return clients.find((client) => client.id === id) ?? null;
  }

  async getContact(id: string) {
    return contacts.find((contact) => contact.id === id) ?? null;
  }

  async getShowroomBySlug(slug: string) {
    const showroom = showrooms.find((entry) => entry.slug === slug);
    if (!showroom) return null;

    const client = await this.getClient(showroom.clientId);
    if (!client) return null;

    const contact = await this.getContact(client.contactPersonId);
    if (!contact) return null;

    const showroomProducts = products.filter((product) =>
      showroom.selectedProductIds.includes(product.id),
    );

    return { showroom, client, contact, products: showroomProducts };
  }
}

export const catalogRepository: CatalogRepository = new LocalCatalogRepository();
