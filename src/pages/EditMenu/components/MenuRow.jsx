import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { CProduct } from "../../../model/invoice";

const MenuRow = ({ product, setMenuProducts }) => {
  const updateProduct = (changes) => {
    setMenuProducts((products) => products.map((item) => item.id === product.id
      ? new CProduct(item.id, changes.name ?? item.name, changes.price ?? item.price)
      : item));
  };

  return (
    <div>
      <Stack direction="row" spacing={1} sx={{ m: 2 }}>
        <div>
          <TextField
            sx={{ width: 164 }}
            id={`textName-${product.id}`}
            label="品項"
            variant="outlined"

            value={product.name}
            onChange={(e) => {
              updateProduct({ name: e.target.value });
                          }}
          />
        </div>

        <div>
          <TextField
            sx={{ width: 140 }}
            id={`textPrice-${product.id}`}
            label="價格"
            variant="outlined"

            value={product.price}
            onChange={(e) => {
              updateProduct({ price: Number(e.target.value) || 0 });
                          }}
          />
        </div>

        <IconButton
          aria-label="delete"
          onClick={() => {
            setMenuProducts((products) => {
              return products.filter((item) => item.id !== product.id);
            });
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    </div>
  );
};

export default MenuRow;

