
import FormattedCurrency from "../NumberFormat";

const ProductForOrderViewNoImage = ({ product }) => {
  return (
    <div className="rounded-main  hover:filter shadow border  hover:bg-main-color hover:text-white">
      <div className="flex flex-row justify-between h-full filter grayscale mx-3 items-center">
        <div className="px-3 py-1">
          <h4>
            {product.internal_code} - {product.name}
          </h4>
        </div>
        {product.comparison_price > 0 ? (
          <p className="flex flex-row">
            <span className="line-through mx-3">
              <FormattedCurrency amount={product.comparison_price} />
            </span>{" "}
            / <FormattedCurrency amount={product.price} />
          </p>
        ) : (
          <FormattedCurrency amount={product.price} />
        )}
      </div>
    </div>
  );
};

export default ProductForOrderViewNoImage;
