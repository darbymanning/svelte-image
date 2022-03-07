<script type="ts">
  export let src: string;
  export let alt: string;
  export let deviceSizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

  const format = src.split(".").pop();
  const formats = ["avif", "webp", format];
</script>

<picture>
  {#each formats as format}
    {#each deviceSizes as size, i}
      <source
        srcset="/api/image-optimiser?file={src}&format={format}&width={size}"
        media="(min-width: {size}px)
        {deviceSizes[i + 1] ? `and (max-width: ${deviceSizes[i + 1]}px)` : ''}"
        type="image/{format}"
      />
    {/each}
  {/each}
  <img src="/api/image-optimiser?file={src}&format={format}" {alt} />
</picture>
