import type { SupabaseClient } from "@supabase/supabase-js";
import { LeadRepository } from "@/src/repositories/LeadRepository";
import type { Database, ProductWithRelations } from "@/src/types/database";
import { leadSchema, type LeadInput } from "@/src/validators/LeadSchema";

export class LeadService {
  private readonly repository: LeadRepository;

  constructor(repository: LeadRepository) {
    this.repository = repository;
  }

  static fromClient(client: SupabaseClient<Database>) {
    return new LeadService(new LeadRepository(client));
  }

  async createLead(input: LeadInput) {
    const parsed = leadSchema.parse(input);
    return this.repository.createLead(parsed);
  }

  async getLeads(options?: { page?: number; limit?: number }) {
    return this.repository.getLeads(options);
  }

  buildWhatsAppMessage(product: ProductWithRelations, productLink: string): string {
    const price = Number(product.price);
    const offer = product.offer_price != null ? Number(product.offer_price) : null;
    const onOffer = offer != null && offer > 0 && offer < price;
    const priceLine = onOffer ? `Price: ₹${offer} (was ₹${price})` : `Price: ₹${price}`;

    return `Hi, I am interested in:\n\nProduct: ${product.name}\nCode: ${product.code}\n${priceLine}\n\nProduct Link: ${productLink}`;
  }

  buildWhatsAppRedirect(phone: string, message: string): string {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  async createLeadAndBuildRedirect(args: {
    lead: LeadInput;
    product: ProductWithRelations;
    productLink: string;
    phone: string;
  }): Promise<string> {
    await this.createLead(args.lead);
    const message = this.buildWhatsAppMessage(args.product, args.productLink);

    return this.buildWhatsAppRedirect(args.phone, message);
  }
}
