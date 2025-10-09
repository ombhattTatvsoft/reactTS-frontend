import Menu from "@mui/material/Menu";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useState, type ReactNode } from "react";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  width?: string;
}

const Dropdown = ({ trigger, children, width = "w-64" }: DropdownProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ClickAwayListener onClickAway={handleClose}>
        <div>
          <div onClick={handleClick} className="cursor-pointer">
            {trigger}
          </div>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              paper: {
                className: `${width}`,
                style: { marginTop: "8px" },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <div className="max-h-96 overflow-y-auto bg-white/95 backdrop-blur-sm">
              {children}
            </div>
          </Menu>
        </div>
      </ClickAwayListener>
    </>
  );
};

export default Dropdown;
