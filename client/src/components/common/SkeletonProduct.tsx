import React from 'react'

const SkeletonProduct = () => {
  return (
    <div className="flex flex-col gap-3">
      {/* 1. Phần ảnh sản phẩm */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-200">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>

      {/* 2. Phần Tên sản phẩm (Dòng 1 dài) */}
      <div className="relative h-4 w-full overflow-hidden rounded bg-gray-200">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>

      {/* 3. Phần Tên sản phẩm (Dòng 2 ngắn hơn) */}
      <div className="relative h-4 w-3/4 overflow-hidden rounded bg-gray-200">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>

      {/* 4. Phần Giá tiền */}
      <div className="relative h-5 w-1/2 overflow-hidden rounded bg-gray-200 mt-2">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
    </div>
  )
}

export default SkeletonProduct