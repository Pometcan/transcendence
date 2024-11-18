<script>
    import Auth from "$lib/components/Auth.svelte";
    import Game from "$lib/components/Game.svelte";
    let navPage = $state(Auth);
</script>

<div class="grid text-center">
    <button class="" onclick={(navPage = Auth)}>Auth</button>
    <button onclick={(navPage = Game)}>Game</button>
</div>

<div>
    {@render navPage()}
</div>
