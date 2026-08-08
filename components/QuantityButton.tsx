import useStore from '@/store'
import { ProductCardProduct } from './product-types';
import { Button } from './ui/button';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Props{
  product: ProductCardProduct;
  className?: string;
}

const QuantityButton = ({product, className} : Props) => {
  const {addItem, removeItem, getItemCount} = useStore();
  const itemCount = getItemCount(product?._id);
  const isOutOfStock = product?.stock === 0;

  const handleRemoveProduct = () => {
    removeItem(product?._id);
    if(itemCount > 1){
      toast.success('Quantity Decreased successfully');
    } else {
      toast.success(`${product?.name?.substring(0, 12)} removed successfully!`);
    }
  };

  const handleAddProduct = () => {
    if((product?.stock as number) > itemCount) {
      addItem(product);
      toast.success('Quantity Increased successfully')
    } else {
      toast.error('Can not add more than available stock')
    }
  }

  return (
    <div className={cn('flex items-center gap-1 pb-1 text-base', className)}>
      <Button
        variant='outline'
        size='icon'
        disabled={itemCount === 0 || isOutOfStock}
        className='shadow-xs hover:bg-shop_dark_green/20 hoverEffect'
        onClick={handleRemoveProduct}
      >
        <Minus />
      </Button>
      <span className='font-semibold text-sm w-6 text-center text-darkColor'>{itemCount}</span>
      <Button
        variant='outline'
        size='icon'
        disabled={itemCount === 0 || isOutOfStock}
        className=' shadow-xs hover:bg-shop_dark_green/20 hoverEffect'
        onClick={handleAddProduct}
      >
        <Plus />
      </Button>
    </div>
  )
}

export default QuantityButton