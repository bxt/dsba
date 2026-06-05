<script lang="ts">
  import { createNow } from "$lib/createNow.svelte";
  import { formatRelative } from "./formatRelative";

  const locale = "en";

  const dateTimeFormat = new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
    timeStyle: "long",
  });

  const shortFormat = new Intl.RelativeTimeFormat(locale, { style: "narrow" });
  const formatShort = formatRelative(shortFormat);
  const longFormat = new Intl.RelativeTimeFormat(locale, { style: "long" });
  const formatLong = formatRelative(longFormat);

  const { date, class: propsClass }: { date: string; class?: string } =
    $props();

  const now = createNow();

  let short = $derived(formatShort(new Date(date), now));
  let long = $derived(
    `${dateTimeFormat.format(new Date(date))} – ${formatLong(new Date(date), now)}`,
  );
</script>

<span class={propsClass} title={long}>
  {short}
</span>
