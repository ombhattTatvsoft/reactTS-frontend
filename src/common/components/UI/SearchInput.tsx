import { InputAdornment, TextField } from "@mui/material";
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput = ({ value, onChange, placeholder }: SearchInputProps) => {
  return (
    <TextField
      fullWidth
      placeholder={placeholder || "Search..."}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search size={18} />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchInput;
