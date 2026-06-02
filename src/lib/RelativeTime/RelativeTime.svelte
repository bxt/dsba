<script lang="ts">
  import { SvelteDate } from "svelte/reactivity";
  import { formatRelative } from "./formatRelative";

  const locale = "de";

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

  let now = new SvelteDate();

  $effect(() => {
    const interval = setInterval(() => {
      now.setTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  });

  let short = $derived(formatShort(new Date(date), now));
  let long = $derived(
    `${dateTimeFormat.format(new Date(date))} – ${formatLong(new Date(date), now)}`,
  );
</script>

<span class={propsClass} title={long}>
  {short}
</span>
