<script>
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    import { Settings } from "lucide-svelte";
    let user = {
        name: "Pometcan",
        email: "Pometcan@42istanbul.com",
        avatar: "https://github.com/shadcn.png",
        gameHistory: [
            {
                opponent: "Ahmet",
                result: "Win",
                skor: "5-3",
                date: "2023-05-15",
            },
            {
                opponent: "Mehmet",
                result: "Loss",
                skor: "2-5",
                date: "2023-05-14",
            },
            {
                opponent: "Deli",
                result: "Win",
                skor: "5-4",
                date: "2023-05-13",
            },
            {
                opponent: "Veli",
                result: "Forfeit",
                skor: "1-3",
                date: "2023-05-12",
            },
            {
                opponent: "Ahmet",
                result: "Win",
                skor: "5-3",
                date: "2023-05-15",
            },
            {
                opponent: "Mehmet",
                result: "Loss",
                skor: "2-5",
                date: "2023-05-14",
            },
            {
                opponent: "Deli",
                result: "Win",
                skor: "5-4",
                date: "2023-05-13",
            },
            {
                opponent: "Veli",
                result: "Forfeit",
                skor: "1-3",
                date: "2023-05-12",
            },
            {
                opponent: "Ahmet",
                result: "Win",
                skor: "5-3",
                date: "2023-05-15",
            },
            {
                opponent: "Mehmet",
                result: "Loss",
                skor: "2-5",
                date: "2023-05-14",
            },
            {
                opponent: "Deli",
                result: "Win",
                skor: "5-4",
                date: "2023-05-13",
            },
            {
                opponent: "Veli",
                result: "Forfeit",
                skor: "1-3",
                date: "2023-05-12",
            },
            {
                opponent: "Ahmet",
                result: "Win",
                skor: "5-3",
                date: "2023-05-15",
            },
            {
                opponent: "Mehmet",
                result: "Loss",
                skor: "2-5",
                date: "2023-05-14",
            },
            {
                opponent: "Deli",
                result: "Win",
                skor: "5-4",
                date: "2023-05-13",
            },
            {
                opponent: "Veli",
                result: "Forfeit",
                skor: "1-3",
                date: "2023-05-12",
            },
            {
                opponent: "Ahmet",
                result: "Win",
                skor: "5-3",
                date: "2023-05-15",
            },
            {
                opponent: "Mehmet",
                result: "Loss",
                skor: "2-5",
                date: "2023-05-14",
            },
            {
                opponent: "Deli",
                result: "Win",
                skor: "5-4",
                date: "2023-05-13",
            },
            {
                opponent: "Veli",
                result: "Forfeit",
                skor: "1-3",
                date: "2023-05-12",
            },
        ],
    };

    let chartCanvas;

    onMount(() => {
        new Chart(chartCanvas, {
            type: "doughnut",
            data: {
                labels: ["Wins", "Losses", "Forfeits"],
                datasets: [
                    {
                        data: [45, 30, 25],
                        backgroundColor: ["#a6e3a1", "#f38ba8", "#f9e2af"],
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom",
                    },
                },
            },
        });
    });
    let isMobile = $state(false);
    const checkMobile = () => {
        if (typeof window !== "undefined") {
            isMobile = window.innerWidth <= 768;
        }
    };
    onMount(() => {
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    });
</script>

<div
    class="d-flex min-vh-100 align-items-center justify-content-center"
    style="background-color: rgba(30, 30, 46, 0.8); width: 100%; min-width: 100%;"
>
    <div style="padding: 28px; color: #cdd6f4; max-width: 1200px;">
        <div class="card-body">
            <div class="d-flex flex-column flex-md-row align-items-center mb-4">
                <img
                    src={user.avatar}
                    alt={user.name}
                    class="rounded-circle mb-3 mb-md-0 me-md-3"
                    style="{isMobile
                        ? 'width: 80%; height: 80%;'
                        : 'width: 150px; height: 150px;'} border: 4px solid #89b4fa;"
                />
                <div
                    class="text-center text-md-start"
                    style="margin-right: 300px;"
                >
                    <h2 class="mb-0">{user.name}</h2>
                    <p class=" mb-0">{user.email}</p>
                </div>
                {#if !isMobile}
                    <button
                        class="btn"
                        style="margin: 0px 5px 25px 5px; background-color: #89b4fa; color: #1e1e2e;"
                    >
                        <Settings />
                    </button>
                {/if}
            </div>

            {#if isMobile}
                <div class="mb-4">
                    <button
                        class="btn w-100"
                        style="background-color: #89b4fa; color: #1e1e2e;"
                    >
                        <Settings />
                        Settings
                    </button>
                </div>
            {/if}
            <div class={isMobile ? "col" : "row"}>
                <div
                    class="col-md-6 container text-left"
                    style="max-height: 20rem; overflow-y: scroll;"
                >
                    {#each user.gameHistory as game}
                        <div
                            class="d-flex justify-content-between align-items-center mb-2 p-2 rounded"
                            style="background-color: #313244; "
                        >
                            <span class="col">{game.opponent}</span>
                            <span
                                class:text-success={game.result === "Win"}
                                class:text-danger={game.result === "Loss"}
                                class:text-warning={game.result === "Forfeit"}
                                class="col"
                            >
                                {game.result}
                            </span>
                            <span class="col">{game.skor}</span>
                            <small class="col">{game.date}</small>
                        </div>
                    {/each}
                </div>
                <div class="col-md-6" style="margin-inline: auto;">
                    <canvas bind:this={chartCanvas}></canvas>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .text-success {
        color: #a6e3a1 !important;
    }
    .text-danger {
        color: #f38ba8 !important;
    }
    .text-warning {
        color: #f9e2af !important;
    }
</style>
