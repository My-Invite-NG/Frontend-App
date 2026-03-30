export interface Ticket {
  id?: number;
  type: string;
  price: string;
  quantity: string;
  description?: string;
}

export interface MediaPreview {
  id?: number;
  url: string;
  type: "image" | "video";
  file?: File;
}

export interface EventFormData {
  title: string;
  category: string;
  description: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  location: string;
  lat: number | null;
  lng: number | null;
  image_url: string;
  tags: string[];
  absorb_fees: boolean;
}

export interface WizardState {
  formData: EventFormData;
  tickets: Ticket[];
  mediaPreviews: MediaPreview[];
  deletedMediaIds: number[];
  mediaFiles: File[];
  coverIndex: number;
  ticketsSold: number;
}
