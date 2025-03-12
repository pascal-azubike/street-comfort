"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { Collection, collections } from '@/config/collections';

const categories = [
  { id: 'all', label: 'All', isActive: true },
  ...collections.map((collection: Collection) => ({
    id: collection.title.toLowerCase().replace(/\s+&\s+|\s+/g, '-'),
    label: collection.title,
    isActive: false,
  })),
];

const sizes = [
  { id: 'XS', label: 'XS' },
  { id: 'S', label: 'S' },
  { id: 'M', label: 'M' },
  { id: 'L', label: 'L' },
  { id: 'XL', label: 'XL' },
];

const sortOptions = [
  { id: 'newest', label: 'Newest', value: 'createdAt-desc' },
  { id: 'price-low', label: 'Price: Low to High', value: 'price-asc' },
  { id: 'price-high', label: 'Price: High to Low', value: 'price-desc' },
  { id: 'name-asc', label: 'Name: A-Z', value: 'name-asc' },
  { id: 'name-desc', label: 'Name: Z-A', value: 'name-desc' },
];

interface ShopFiltersProps {
  variant?: 'sidebar' | 'dropdown';
  selectedCategory: string[];
  selectedSort: string;
  selectedSizes: string[];
  onApplyFilters: (filters: { category: string[]; sort: string; sizes: string[] }) => void;
  onResetFilters: () => void;
}

export function ShopFilters({
  variant = 'sidebar',
  selectedCategory,
  selectedSort,
  selectedSizes,
  onApplyFilters,
  onResetFilters,
}: ShopFiltersProps) {
  const [tempCategories, setTempCategories] = useState<string[]>(selectedCategory);
  const [tempSizes, setTempSizes] = useState<string[]>(selectedSizes);
  const [tempSort, setTempSort] = useState<string>(selectedSort);

  useEffect(() => {
    setTempCategories(selectedCategory);
    setTempSizes(selectedSizes);
    setTempSort(selectedSort);
  }, [selectedCategory, selectedSizes, selectedSort]);

  const handleCategoryChange = (categoryId: string) => {
    setTempCategories(prev => {
      if (categoryId === 'all') {
        return ['all'];
      }
      const newSelected = prev.filter(id => id !== 'all');
      if (prev.includes(categoryId)) {
        return newSelected.filter(id => id !== categoryId);
      } else {
        return [...newSelected, categoryId];
      }
    });
  };

  const handleSizeChange = (sizeId: string) => {
    setTempSizes(prev => {
      if (prev.includes(sizeId)) {
        return prev.filter(id => id !== sizeId);
      } else {
        return [...prev, sizeId];
      }
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      category: tempCategories,
      sort: tempSort,
      sizes: tempSizes,
    });
  };

  const handleResetFilters = () => {
    setTempCategories(['all']);
    setTempSizes([]);
    setTempSort('newest');
    onResetFilters();
  };

  return (
    <div className={cn("space-y-6", variant === 'dropdown' && "p-4")}>
      {/* Sort */}
      <div>
        <h3 className="font-medium text-[#593C2D] mb-4 font-['Segoe_UI']">SORT BY</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between border-white/20 bg-white/10 text-[#593C2D] hover:bg-white/20 font-['Segoe_UI']"
            >
              <span>{sortOptions.find(opt => opt.value === tempSort)?.label || 'Sort By'}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.id}
                onClick={() => setTempSort(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-medium text-[#593C2D] mb-4 font-['Segoe_UI']">Category</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`${variant}-${category.id}`}
                checked={tempCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryChange(category.id)}
              />
              <label htmlFor={`${variant}-${category.id}`} className="text-sm cursor-pointer">
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="font-medium text-[#593C2D] mb-4 font-['Segoe_UI']">Sizes</h3>
        <div className="flex flex-wrap gap-3">
          {sizes.map((size) => (
            <div key={size.id} className="flex items-center gap-2">
              <Checkbox
                id={`${variant}-${size.id}`}
                checked={tempSizes.includes(size.id)}
                onCheckedChange={() => handleSizeChange(size.id)}
              />
              <label htmlFor={`${variant}-${size.id}`} className="text-sm cursor-pointer">
                {size.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Apply and Reset Buttons */}
      <div className="space-y-2 pt-4">
        <Button 
          className="w-full bg-[#593C2D] hover:bg-[#593C2D]/90 text-white font-['Segoe_UI']"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
        <Button 
          variant="outline"
          className="w-full border-[#593C2D] text-[#593C2D] hover:bg-[#593C2D] hover:text-white font-['Segoe_UI']"
          onClick={handleResetFilters}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
} 