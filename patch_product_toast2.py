with open('src/components/ProductDetail.tsx', 'r') as f:
    content = f.read()

old_code = """    addToCart({
      id: product.id,
      variantId: selectedVariant.id,
      title: product.title,
      subtext: firstSentence,
      price: parseFloat(price),
      image: primaryImage,
      size: !hasShopifyVariants && allColors.length > 0
        ? `${selectedColor} / ${selectedSize}`
        : (allSizes.length > 0 ? selectedSize : selectedVariant.title),
    });
  };"""

new_code = """    addToCart({
      id: product.id,
      variantId: selectedVariant.id,
      title: product.title,
      subtext: firstSentence,
      price: parseFloat(price),
      image: primaryImage,
      size: !hasShopifyVariants && allColors.length > 0
        ? `${selectedColor} / ${selectedSize}`
        : (allSizes.length > 0 ? selectedSize : selectedVariant.title),
    });
    
    toast.success('Added to your bespoke collection', {
      description: `${product.title} has been added to your bag`,
      duration: 3000,
    });
  };"""

if old_code in content:
    content = content.replace(old_code, new_code)
    print("Replaced!")
else:
    print("Not found in content")

with open('src/components/ProductDetail.tsx', 'w') as f:
    f.write(content)
