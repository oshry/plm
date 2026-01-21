# Fashion PLM Frontend Guide

## 🎨 React Frontend with Tailwind CSS

The frontend is a modern React application built with TypeScript and styled with Tailwind CSS.

## 🚀 Running the Application

### Start Backend
```bash
cd backend
pnpm dev
```
Backend runs on: http://localhost:3000

### Start Frontend
```bash
cd frontend
pnpm dev
```
Frontend runs on: http://localhost:5173

## 📱 Features

### 1. Garment List View
- **Grid Layout**: Displays all garments in a responsive grid
- **Lifecycle Badges**: Color-coded badges for each state
  - CONCEPT: Gray
  - DESIGN: Blue
  - SAMPLE: Yellow
  - APPROVED: Green
  - MASS_PRODUCTION: Purple
- **Quick Info**: Shows category and last update date
- **Variation Indicator**: Shows if garment is a design variation
- **Create Button**: Quick access to create new garments

### 2. Garment Detail View
- **Full Information**: Name, category, lifecycle state
- **Design Variations**: Shows base design and change notes
- **Lifecycle Management**: Dropdown to change state
- **Materials**: List with percentages
- **Attributes**: Tag-style display
- **Suppliers**: Shows associated suppliers with status
- **Design Variations**: Lists all variations of this garment
- **Actions**: Edit and Delete buttons
- **Timestamps**: Created and updated dates

### 3. Create/Edit Garment Form
- **Basic Info**: Name, category, lifecycle state
- **Design Evolution**: Base design ID and change notes for variations
- **Materials**: Add multiple materials with percentages
  - Real-time percentage total calculation
  - Warning if total ≠ 100%
- **Attributes**: Multi-select with toggle buttons
  - Automatic incompatibility validation
  - Shows conflicts before submission
- **Validation**: Client-side and server-side validation

## 🎯 User Workflows

### Create a New Garment
1. Click "**+ New Garment**" button
2. Fill in name and category (required)
3. Select lifecycle state (defaults to CONCEPT)
4. Add materials with percentages
5. Select attributes (validates incompatibilities)
6. Click "**Create**"

### Create a Design Variation
1. Click "**+ New Garment**"
2. Enter **Base Design ID** (the garment you're varying from)
3. Add a **Change Note** describing the changes
4. Fill in other details
5. Click "**Create**"

### View Garment Details
1. Click any garment card in the list
2. View all information, materials, attributes, suppliers
3. See design variations if any exist

### Edit a Garment
1. Open garment detail view
2. Click "**Edit**" button
3. Modify name, category, lifecycle state, or change note
4. Click "**Update**"

### Change Lifecycle State
1. Open garment detail view
2. Use the lifecycle dropdown
3. Select new state
4. Changes save automatically

### Delete a Garment
1. Open garment detail view
2. Click "**Delete**" button
3. Confirm deletion
4. **Note**: Cannot delete MASS_PRODUCTION garments

## 🎨 UI Components

### GarmentList Component
```tsx
<GarmentList 
  onSelectGarment={(garment) => {...}}
  onCreateNew={() => {...}}
/>
```
- Displays all garments in a grid
- Handles loading and error states
- Responsive design (1/2/3 columns)

### GarmentDetail Component
```tsx
<GarmentDetail
  garmentId={id}
  onBack={() => {...}}
  onEdit={(garment) => {...}}
/>
```
- Shows complete garment information
- Lifecycle state management
- Delete protection for MASS_PRODUCTION
- Loads suppliers and variations

### GarmentForm Component
```tsx
<GarmentForm
  garment={existingGarment}  // Optional for edit mode
  onSave={() => {...}}
  onCancel={() => {...}}
/>
```
- Create or edit mode
- Material composition builder
- Attribute selector with validation
- Design variation support

## 🔌 API Integration

### API Client (`src/api/client.ts`)
Generic HTTP client with:
- JSON content type handling
- Error handling
- Type-safe responses

### Garments API (`src/api/garments.ts`)
```typescript
garmentsApi.getAll()
garmentsApi.getById(id)
garmentsApi.create(data)
garmentsApi.update(id, data)
garmentsApi.delete(id)
garmentsApi.getMaterials(id)
garmentsApi.addMaterial(id, materialId, percentage)
garmentsApi.getAttributes(id)
garmentsApi.addAttribute(id, attributeId)

materialsApi.getAll()
attributesApi.getAll()
attributesApi.validate(attributeIds)
suppliersApi.getGarmentSuppliers(garmentId)
```

## 📦 Project Structure

```
frontend/src/
├── api/
│   ├── client.ts           # HTTP client
│   └── garments.ts         # API endpoints
├── components/
│   ├── GarmentList.tsx     # List view
│   ├── GarmentDetail.tsx   # Detail view
│   └── GarmentForm.tsx     # Create/edit form
├── types/
│   └── index.ts            # TypeScript types
├── App.tsx                 # Main app component
├── main.tsx                # React entry point
└── index.css               # Tailwind CSS
```

## 🎨 Tailwind CSS

### Configuration
- `tailwind.config.js`: Tailwind configuration
- `postcss.config.js`: PostCSS with Tailwind and Autoprefixer
- `index.css`: Tailwind directives

### Color Scheme
- **Primary**: Blue (buttons, links)
- **Success**: Green (approved states)
- **Warning**: Yellow (sample states)
- **Danger**: Red (delete, errors)
- **Neutral**: Gray (backgrounds, borders)

### Responsive Design
- Mobile-first approach
- Breakpoints: `sm`, `md`, `lg`
- Grid adapts: 1 → 2 → 3 columns

## 🔍 Business Rules in UI

### Attribute Incompatibility
- Validates before submission
- Shows conflict details
- Prevents invalid combinations
- Example: "Nightwear ↔ Running Outfit"

### Lifecycle Protection
- Cannot delete MASS_PRODUCTION garments
- Shows error message
- Prevents accidental data loss

### Material Validation
- Percentage must be 0-100
- Shows total percentage
- Warns if total ≠ 100%

## 🚦 State Management

Simple React state with hooks:
- `useState` for component state
- View routing: 'list' | 'detail' | 'create' | 'edit'
- Selected garment tracking
- No external state library needed

## 🎯 Key Features

### ✅ Implemented
- Full CRUD operations
- Lifecycle state management
- Material composition
- Attribute selection with validation
- Design variation tracking
- Supplier display
- Responsive design
- Error handling
- Loading states

### 🎨 Design Highlights
- Clean, modern UI
- Tailwind CSS utility classes
- Consistent spacing and typography
- Hover effects and transitions
- Color-coded lifecycle states
- Tag-style attribute display

## 🧪 Testing the Frontend

1. **List View**: Should show 5 seed garments
2. **Click a Garment**: Opens detail view with materials and attributes
3. **Create New**: Form with material and attribute selection
4. **Validation**: Try incompatible attributes (Nightwear + Running Outfit)
5. **Edit**: Modify garment details
6. **Delete**: Try deleting MASS_PRODUCTION garment (should fail)
7. **Lifecycle**: Change state via dropdown

## 🔧 Environment Variables

Create `.env` file in frontend directory:
```env
VITE_API_URL=http://localhost:3000
```

Default: http://localhost:3000

## 📝 Notes

- **CSS Warnings**: `@tailwind` warnings in IDE are expected, Tailwind works fine
- **TypeScript**: `import.meta.env` warning is expected, Vite provides this at runtime
- **Hot Reload**: Changes auto-reload in development
- **API Errors**: Shown in red alert boxes with retry options

## 🎉 Complete!

The frontend provides a full-featured interface for managing fashion products through their entire lifecycle!
