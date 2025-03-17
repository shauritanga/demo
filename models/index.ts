import mongoose, { Schema, Document } from "mongoose";

//Client Model
export interface IClient extends Document {
  _id: string;
  name: string;
  district: string;
  region: string;
  streetAddress: string;
  country: string;
  email: string;
  tin: string;
  vat: string;
  phone: string;
}

const clientSchema = new Schema<IClient>({
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  district: { type: String, required: true },
  region: { type: String, required: true },
  phone: { type: String },
  streetAddress: { type: String },
  tin: { type: String, unique: true },
  vat: { type: String, unique: true },
  country: { type: String },
});

const Client =
  mongoose.models?.Client || mongoose.model<IClient>("Client", clientSchema);

//Bill of landing model
export interface IBillOfLanding extends Document {
  _id: string;
  bolNumber: string;
  countryLastConsignment: string;
  countryOfExeport: string;
  entryOffice: string;
  containers: {
    containerNumber: string;
    tareWeight: number;
    grossWeight: number;
  }[];
  goods: {
    description: string;
    quantity: number;
    weight: number;
    value?: number;
    containerReference?: string;
  }[];
  freightCharges: {
    amount: number;
    currency: string;
  };
  insurance: {
    amount: number;
    currency: string;
  };
  term: {
    code?: string;
    place?: string;
  };
  tansad: {
    number?: string;
    date?: Date;
  };
  portOfLoading: string;
  portOfDischarge: string;
  deliveryPlace?: string;
  arrivalDate?: Date;
  releasedDate?: string;
  shipper: Schema.Types.ObjectId;
  notifyParty: Schema.Types.ObjectId;
  consignee: Schema.Types.ObjectId;
  shippingLine?: string;
  shippingOrder?: string;
  tradingCountry?: string;
  vessleName?: string;
  packingList: {
    totalPackages?: number;
    totalNetWeight?: number;
    totalGrossWeight?: number;
    totalVolume?: number;
    file?: any;
  };
  portInvoice: {
    invoiceNumber?: string;
    amount?: number;
    currency?: string;
    date?: Date;
    file?: any;
  };
  createdAt: Date;
}

// Define the Bill of Lading Schema
const billOfLandingSchema = new Schema<IBillOfLanding>(
  {
    bolNumber: { type: String },
    countryLastConsignment: { type: String },
    countryOfExeport: { type: String },
    entryOffice: { type: String },
    containers: [
      {
        containerNumber: { type: String, required: true },
        tareWeight: { type: Number, required: true },
        grossWeight: { type: Number, required: true },
      },
    ],
    goods: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        weight: { type: Number, required: true },
        value: { type: Number },
        containerReference: { type: String },
      },
    ],
    freightCharges: {
      amount: { type: Number, required: true },
      currency: { type: String, default: "USD" },
    },
    insurance: {
      amount: { type: Number, required: true },
      currency: { type: String, default: "USD" },
    },
    term: { code: String, place: String },
    tansad: { number: String, date: Date },
    portOfLoading: { type: String, required: true },
    portOfDischarge: { type: String, required: true },
    deliveryPlace: { type: String },
    arrivalDate: { type: Date },
    releasedDate: { type: String },
    shipper: { type: Schema.Types.ObjectId, ref: "Client" },
    notifyParty: { type: Schema.Types.ObjectId, ref: "Client" },
    consignee: { type: Schema.Types.ObjectId, ref: "Client" },
    shippingLine: { type: String },
    shippingOrder: { type: String },
    tradingCountry: { type: String },
    vessleName: { type: String },
    packingList: {
      totalPackages: Number,
      totalNetWeight: Number,
      totalGrossWeight: Number,
      totalVolume: Number,
      file: { type: Schema.Types.Mixed, default: null },
    },
    portInvoice: {
      invoiceNumber: String,
      amount: Number,
      currency: String,
      date: Date,
      file: { type: Schema.Types.Mixed, default: null },
    },
  },
  { timestamps: true }
);

// Create the Bill of Lading model
const BillOfLanding =
  mongoose.models?.BillOfLanding ||
  mongoose.model<IBillOfLanding>("BillOfLanding", billOfLandingSchema);

//File Model

const fileSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["file", "folder"],
    },
    size: {
      type: Number,
      required: true,
      default: 0,
    },
    lastModified: {
      type: Date,
      required: true,
      default: Date.now,
    },
    path: {
      type: String,
      required: true,
    },
    parentPath: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
      sparse: true, // Only files will have this
    },
    url: {
      type: String,
      sparse: true, // Only files will have this
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        // Convert lastModified to ISO string for frontend
        ret.lastModified = ret.lastModified.toISOString();
        // Remove mongoose specific fields
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
  }
);

// Indexes for faster queries
fileSchema.index({ path: 1 });
fileSchema.index({ parentPath: 1 });

// Middleware to handle cascading deletes for folders
fileSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    if (this.type === "folder") {
      // Delete all files and folders inside this folder
      await mongoose.model("File").deleteMany({
        path: { $regex: `^${this.path}/` },
      });
    }
  }
);

// Create the model
const File = mongoose.models.File || mongoose.model("File", fileSchema);

/* ============================= INVOICE ================================== */
interface IInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface ITax {
  rate: number;
  amount: number;
}

interface IDiscount {
  rate?: number;
  amount?: number;
}

export interface IInvoice extends Document {
  _id: string;
  invoiceNumber: string;
  client: mongoose.Types.ObjectId;
  items: IInvoiceItem[];
  subtotal: number;
  tax: ITax;
  discount: IDiscount;
  totalAmount: number;
  issueDate: Date;
  dueDate: Date;
  status: "draft" | "sent" | "paid" | "overdue" | "canceled";
  paymentTerms: string;
  notes?: string;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Client reference is required"],
      // index: true,
    },
    items: [
      {
        description: {
          type: String,
          required: [true, "Item description is required"],
          trim: true,
          minlength: [2, "Description must be at least 2 characters"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
          validate: {
            validator: Number.isInteger,
            message: "Quantity must be an integer",
          },
        },
        unitPrice: {
          type: Number,
          required: [true, "Unit price is required"],
          min: [0, "Unit price cannot be negative"],
          validate: {
            validator: (v: number) => Number(v.toFixed(2)) === v,
            message: "Unit price must have at most 2 decimal places",
          },
        },
        total: {
          type: Number,
          // required: [true, "Item total is required"],
          min: [0, "Item total cannot be negative"],
        },
      },
    ],
    subtotal: {
      type: Number,
      // required: [true, "Subtotal is required"],
      min: [0, "Subtotal cannot be negative"],
    },
    tax: {
      rate: {
        type: Number,
        default: 0,
        min: [0, "Tax rate cannot be negative"],
        max: [100, "Tax rate cannot exceed 100%"],
      },
      amount: {
        type: Number,
        default: 0,
        min: [0, "Tax amount cannot be negative"],
      },
    },
    discount: {
      rate: {
        type: Number,
        min: [0, "Discount rate cannot be negative"],
        max: [100, "Discount rate cannot exceed 100%"],
        default: 0,
      },
      amount: {
        type: Number,
        min: [0, "Discount amount cannot be negative"],
        default: 0,
      },
    },
    totalAmount: {
      type: Number,
      min: [0, "Total cannot be negative"],
    },
    issueDate: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
      validate: {
        validator: function (v: Date) {
          return v > this.issueDate;
        },
        message: "Due date must be after issue date",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["draft", "sent", "paid", "overdue", "canceled"],
        message: "{VALUE} is not a valid status",
      },
      default: "draft",
      index: true,
    },
    paymentTerms: {
      type: String,
      default: "Due upon receipt",
      trim: true,
      enum: {
        values: ["Due upon receipt", "Net 15", "Net 30", "Net 60"],
        message: "{VALUE} is not a valid payment term",
      },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// invoiceSchema.index({ invoiceNumber: 1 }, { unique: true });
invoiceSchema.index({ dueDate: 1, status: 1 });

// Virtual for days until due
invoiceSchema.virtual("daysUntilDue").get(function () {
  const diff = this.dueDate.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 3600 * 24));
});

// Generate invoice number
async function generateInvoiceNumber(): Promise<string> {
  const date = new Date();
  const dateString = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD

  // Find the last invoice for today to get the sequence
  const lastInvoice = await mongoose.models.Invoice.findOne({
    invoiceNumber: { $regex: `^INV-${dateString}` },
  }).sort({ invoiceNumber: -1 });

  let sequence = 1;
  if (lastInvoice) {
    const lastSequence = parseInt(lastInvoice.invoiceNumber.slice(-4));
    sequence = lastSequence + 1;
  }

  const sequenceString = sequence.toString().padStart(4, "0");
  return `INV-${dateString}-${sequenceString}`;
}

// Pre-save middleware with invoice number generation
invoiceSchema.pre("save", async function (next) {
  if (this.isNew && !this.invoiceNumber) {
    this.invoiceNumber = await generateInvoiceNumber();
  }

  // Calculate item totals
  this.items.forEach((item) => {
    item.total = Number((item.quantity * item.unitPrice).toFixed(2));
  });

  // Calculate subtotal
  this.subtotal = Number(
    this.items.reduce((sum, item) => sum + item.total, 0).toFixed(2)
  );

  // Calculate tax amount
  this.tax.amount = Number(((this.subtotal * this.tax.rate) / 100).toFixed(2));

  // Calculate discount amount if rate is provided
  if (this.discount.rate) {
    this.discount.amount = Number(
      ((this.subtotal * this.discount.rate) / 100).toFixed(2)
    );
  }

  // Calculate total amount
  this.totalAmount = Number(
    (this.subtotal + this.tax.amount - (this.discount.amount || 0)).toFixed(2)
  );

  next();
});

// Pre-validate middleware
invoiceSchema.pre("validate", function (next) {
  if (this.isNew && this.issueDate > this.dueDate) {
    this.invalidate(
      "dueDate",
      "Due date must be after issue date",
      this.dueDate
    );
  }

  if (this.discount.rate && this.discount.amount) {
    this.invalidate(
      "discount",
      "Provide either discount rate or amount, not both",
      this.discount
    );
  }

  next();
});

// Static methods
invoiceSchema.statics.findOverdue = function () {
  return this.find({
    status: { $in: ["sent", "draft"] },
    dueDate: { $lt: new Date() },
  });
};

// Virtual for days until due
invoiceSchema.virtual("daysUntilDue").get(function () {
  const diff = this.dueDate.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 3600 * 24));
});

// Instance method to mark as paid
invoiceSchema.methods.markAsPaid = async function () {
  this.status = "paid";
  return this.save();
};

// Instance method to mark as sent
invoiceSchema.methods.markAsSent = async function () {
  this.status = "sent";
  return this.save();
};
// Instance method to mark as paid
invoiceSchema.methods.markAsPaid = async function () {
  this.status = "paid";
  return this.save();
};

// Instance methods
invoiceSchema.methods.applyDiscount = async function (
  rateOrAmount: number,
  isRate: boolean = true
) {
  if (isRate) {
    this.discount.rate = rateOrAmount;
    this.discount.amount = 0;
  } else {
    this.discount.amount = rateOrAmount;
    this.discount.rate = 0;
  }
  return this.save();
};

invoiceSchema.set("toJSON", { virtuals: true });
invoiceSchema.set("toObject", { virtuals: true });

const Invoice =
  mongoose.models?.Invoice ||
  mongoose.model<IInvoice>("Invoice", invoiceSchema);

/* ============================= END INVOICE ================================== */

/* ============================= PROFORMA INVOICE ================================== */

export interface IProformaInvoice extends Document {
  _id: mongoose.Types.ObjectId;
  proformaNumber: string;
  client: mongoose.Types.ObjectId;
  bol: mongoose.Types.ObjectId;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  estimatedSubtotal: number;
  tax: {
    rate: number;
    amount: number;
  };
  discount: {
    rate: number;
    amount: number;
  };
  estimatedTotal: number;
  issueDate: Date;
  expiryDate: Date;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  shippingTerms: string;
  validityPeriod: string;
  notes?: string;
}

// Define the Proforma Invoice Schema
const proformaInvoiceSchema = new Schema<IProformaInvoice>(
  {
    proformaNumber: {
      type: String,
    },
    client: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    bol: { type: Schema.Types.ObjectId, ref: "BillOfLanding", required: true }, // Fixed typo
    items: [
      {
        description: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        total: {
          type: Number,
        },
      },
    ],

    tax: {
      rate: {
        type: Number,
        default: 0,
        min: [0, "Tax rate cannot be negative"],
        max: [100, "Tax rate cannot exceed 100%"],
      },
      amount: {
        type: Number,
        default: 0,
        min: [0, "Tax amount cannot be negative"],
      },
    },
    discount: {
      rate: {
        type: Number,
        min: [0, "Discount rate cannot be negative"],
        max: [100, "Discount rate cannot exceed 100%"],
        default: 0,
      },
      amount: {
        type: Number,
        min: [0, "Discount amount cannot be negative"],
        default: 0,
      },
    },
    estimatedSubtotal: {
      type: Number,
      min: [0, "Subtotal cannot be negative"],
    },
    estimatedTotal: {
      type: Number,
      min: [0, "Total cannot be negative"],
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "sent", "accepted", "rejected", "expired"],
      default: "draft",
    },
    shippingTerms: {
      type: String,
      default: "Not specified",
    },
    validityPeriod: {
      type: String,
      default: "Valid until expiry date",
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Generate invoice number
async function generateProformaNumber(): Promise<string> {
  const date = new Date();
  const dateString = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD

  // Find the last invoice for today to get the sequence
  const lastInvoice = await mongoose.models.ProformaInvoice.findOne({
    proformaNumber: { $regex: `^PRO-${dateString}` },
  }).sort({ proformaNumber: -1 });

  let sequence = 1;
  if (lastInvoice) {
    const lastSequence = parseInt(lastInvoice.proformaNumber.slice(-4));
    sequence = lastSequence + 1;
  }

  const sequenceString = sequence.toString().padStart(4, "0");
  return `PRO-${dateString}-${sequenceString}`;
}

proformaInvoiceSchema.pre("save", async function (next) {
  if (this.isNew && !this.proformaNumber) {
    this.proformaNumber = await generateProformaNumber();
  }

  if (this.isModified("items")) {
    this.items.forEach((item) => {
      item.total = item.quantity * item.unitPrice;
    });
    this.estimatedSubtotal = this.items.reduce(
      (sum, item) => sum + item.total,
      0
    );
  }

  if (this.isModified("tax.rate") || this.isModified("estimatedSubtotal")) {
    this.tax.amount = Number(
      ((this.tax.rate / 100) * this.estimatedSubtotal).toFixed(2)
    );
  }

  if (
    this.isModified("discount.rate") ||
    this.isModified("estimatedSubtotal")
  ) {
    this.discount.amount = Number(
      ((this.estimatedSubtotal * this.discount.rate) / 100).toFixed(2)
    );
  }

  if (
    this.isModified("estimatedSubtotal") ||
    this.isModified("tax.amount") ||
    this.isModified("discount.amount")
  ) {
    this.estimatedTotal = Number(
      (
        this.estimatedSubtotal +
        this.tax.amount -
        (this.discount.amount || 0)
      ).toFixed(2)
    );
  }

  next();
});

proformaInvoiceSchema.index({ proformaNumber: 1 }, { unique: true });
proformaInvoiceSchema.index({ client: 1 });
proformaInvoiceSchema.index({ bol: 1 });

// Create the Proforma Invoice model
const ProformaInvoice =
  mongoose.models?.ProformaInvoice ||
  mongoose.model<IProformaInvoice>("ProformaInvoice", proformaInvoiceSchema);

/* ============================= END PROFORMA INVOICE ================================== */

/* ============================= QUOTATION ================================== */

const QuotationSchema = new mongoose.Schema(
  {
    quotationNumber: {
      type: String,
      required: true,
      unique: true, // Unique identifier for the quotation (e.g., "QTN-2025-001")
    },
    client: { type: Schema.Types.ObjectId, ref: "Client" },
    bol: { type: Schema.Types.ObjectId, ref: "BillOfLanding" },
    issuedDate: {
      type: Date,
      default: Date.now, // Date the quotation was issued
    },
    validUntil: {
      type: Date,
      required: true, // Expiration date of the quotation
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "expired"],
      default: "pending", // Tracks the quotation’s lifecycle
    },
    services: {
      clearing: {
        enabled: { type: Boolean, default: false },
        customsFees: { type: Number, default: 0 }, // Customs clearance fees
        dutiesAndTaxes: { type: Number, default: 0 }, // Estimated duties/taxes
        agentFees: { type: Number, default: 0 }, // Clearing agent service fees
        additionalCharges: [
          {
            description: { type: String }, // e.g., "Inspection fee"
            amount: { type: Number, default: 0 },
          },
        ],
      },
      forwarding: {
        enabled: { type: Boolean, default: false },
        freightCharges: { type: Number, default: 0 }, // Base freight cost
        surcharges: [
          {
            type: { type: String }, // e.g., "BAF", "CAF"
            amount: { type: Number, default: 0 },
          },
        ],
        originCharges: { type: Number, default: 0 }, // Port/terminal fees at origin
        destinationCharges: { type: Number, default: 0 }, // Fees at destination
        transitTime: { type: String }, // e.g., "20 days"
        incoterms: {
          type: String,
          enum: ["FOB", "CIF", "DDP", "EXW"],
          default: "FOB",
        },
      },
      logistics: {
        enabled: { type: Boolean, default: false },
        transportation: [
          {
            mode: { type: String, enum: ["air", "sea", "road", "rail"] },
            cost: { type: Number, default: 0 },
          },
        ],
        warehousing: {
          enabled: { type: Boolean, default: false },
          duration: { type: Number }, // Days of storage
          cost: { type: Number, default: 0 },
        },
        insurance: {
          enabled: { type: Boolean, default: false },
          coverageAmount: { type: Number, default: 0 },
          cost: { type: Number, default: 0 },
        },
        lastMileDelivery: { type: Number, default: 0 }, // Final delivery cost
      },
    },
    cargoDetails: {
      description: { type: String, required: true }, // e.g., "Electronics"
      weight: { type: Number, required: true }, // In kilograms
      volume: { type: Number }, // In cubic meters (optional)
      dimensions: {
        length: { type: Number },
        width: { type: Number },
        height: { type: Number },
      },
      hazardous: { type: Boolean, default: false },
    },
    origin: {
      type: String,
      required: true, // e.g., "Shanghai, China"
    },
    destination: {
      type: String,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

// Virtual field to calculate total cost dynamically (optional)
QuotationSchema.virtual("calculatedTotalCost").get(function () {
  const clearingTotal =
    (this.services?.clearing?.customsFees || 0) +
    (this.services?.clearing?.dutiesAndTaxes || 0) +
    (this.services?.clearing?.agentFees || 0) +
    (this.services?.clearing?.additionalCharges?.reduce(
      (sum, charge) => sum + (charge.amount || 0),
      0
    ) || 0);

  const forwardingTotal =
    (this.services?.forwarding?.freightCharges || 0) +
    (this.services?.forwarding?.originCharges || 0) +
    (this.services?.forwarding?.destinationCharges || 0) +
    (this.services?.forwarding?.surcharges?.reduce(
      (sum, surcharge) => sum + (surcharge.amount || 0),
      0
    ) || 0);

  const logisticsTotal =
    (this.services?.logistics?.transportation?.reduce(
      (sum, t) => sum + (t.cost || 0),
      0
    ) || 0) +
    (this.services?.logistics?.warehousing?.cost || 0) +
    (this.services?.logistics?.insurance?.cost || 0) +
    (this.services?.logistics?.lastMileDelivery || 0);

  return clearingTotal + forwardingTotal + logisticsTotal;
});

// Ensure virtuals are included when converting to JSON
QuotationSchema.set("toJSON", { virtuals: true });

const Quotation =
  mongoose.models?.Quotation || mongoose.model("Quotation", QuotationSchema);
/* ============================= END QUOTATION ================================== */

/* ============================= ROLE ================================== */

const permissionSchema = new Schema({
  create: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
  update: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
});
const roleSchema = new Schema({
  name: { type: String },
  permissions: {
    bils: permissionSchema,
    users: permissionSchema,
    clients: permissionSchema,
    reports: permissionSchema,
    transactions: permissionSchema,
    invoices: permissionSchema,
    roles: permissionSchema,
  },
});

const Role = mongoose.models?.Role || mongoose.model("Role", roleSchema);

/* ============================= END ROLE ================================== */
/* ============================= TRANSACTION ================================== */

export interface ITransaction extends Document {
  _id: string;
  client: mongoose.Types.ObjectId;
  transactionDate: Date;
  status: "pending" | "approved" | "rejected";
  amount: number;
  category: "payments" | "expenses";
  currency: "USD" | "TZS";
  description: string;
}

const transactionSchema = new Schema<ITransaction>({
  transactionDate: { type: Date, default: Date.now },
  client: { type: Schema.Types.ObjectId, ref: "Client" },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  category: { type: String, enum: ["payments", "expenses"], required: true },
  description: { type: String },
});

const Transaction =
  mongoose.models?.Transaction ||
  mongoose.model<ITransaction>("Transaction", transactionSchema);

/* ============================= END TRANSACTION ================================== */

/* ============================= USER ================================== */

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  position: string;
  phone: string;
  role: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  position: { type: String },
  phone: { type: String },
  role: { type: String, required: true },
});

const User = mongoose.models?.User || mongoose.model<IUser>("User", userSchema);
/* ============================= END USER ================================== */

export {
  Client,
  BillOfLanding,
  File,
  Invoice,
  ProformaInvoice,
  Quotation,
  Role,
  Transaction,
  User,
};
