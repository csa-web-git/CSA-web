import { colorPickerField } from "@/fields/ColorPicker";
import { CollectionConfig } from "payload";

export const ForumTypes: CollectionConfig = {
  slug: 'forum-type',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    colorPickerField,
  ],
}