<script>
    import {
        Home,
        Users,
        Trophy,
        Settings,
        Globe,
        User,
        Menu,
        CircleChevronLeft,
    } from "lucide-svelte";
    import { onMount } from "svelte";
    import Auth from "$lib/components/Auth.svelte";
    import Hub from "$lib/components/Hub.svelte";
    import GameHub from "$lib/components/GameHub.svelte";

    let showLanguages = $state(false);
    let navPage = $state(Auth);

    const topButtons = [
        {
            id: "single",
            icon: User,
            label: "Play Single",
            click: () => {
                navPage = GameHub;
            },
        },
        {
            id: "multiplayer",
            icon: Users,
            label: "Play Multiplayer",
            click: () => {
                navPage = GameHub;
            },
        },
        {
            id: "tournament",
            icon: Trophy,
            label: "Play in Tournament",
            click: () => {
                navPage = GameHub;
            },
        },
    ];
    let hoveredButton = $state("");
    let showLanguage = $state(false);
    function handleLanguageHover(isHovering) {
        showLanguages.set(isHovering);
    }
    function setHoveredButton(button) {
        hoveredButton = button;
    }
    function clearHoveredButton() {
        hoveredButton = "";
    }
    let isInGame = $state(false);
    let isMobile = $state(false);
    let isMenuOpen = $state(false);
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
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }
</script>

{#if isMobile}
    <button
        class="btn fixed top-4 left-4 z-500 bg-transparent border-none cursor-pointer"
        style="transition: all 0.3s ease; position: absolute; top: 8px; left: 16px; var(--text)"
        type="button"
        onclick={toggleMenu}
    >
        <Menu size={36} color="#ffffff" />
    </button>
{/if}
<nav
    style="
    height: 100vh; position: fixed; left: 0; top: 0; border-right: 2px solid #cba6f7; background-color: #1e1e2e; transition: all 0.3s ease;
    width: {isMobile
        ? '100vW; border-right: none'
        : '75px; border-right: 2px solid #cba6f7'};
    transform: translateX({isMobile && !isMenuOpen ? '-100%' : '0'});"
>
    <div
        style="display: flex; flex-direction: column; height: 100vh;
        justify-content: {isMobile ? 'flex-start' : 'space-between'};"
    >
        <div class="d-flex flex-column align-items-center w-100">
            <div class="mt-3">
                <button
                    onmouseenter={() => setHoveredButton("Profile")}
                    onmouseleave={clearHoveredButton}
                    onkeydown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            navPage = Hub;
                            toggleMenu();
                        }
                    }}
                    type="button"
                    draggable="false"
                    onclick={() => {
                        navPage = Hub;
                        toggleMenu();
                    }}
                    class="btn"
                >
                    <img
                        src="https://github.com/shadcn.png"
                        alt="Profile"
                        class="rounded-circle selectDisable profile-image"
                    />
                    {#if hoveredButton === "Profile" && !isMobile}
                        <span class="button-label"> Profile </span>
                    {/if}
                    {#if isMobile}
                        <span style="margin-left: 4px; font-size: 26px; ">
                            Profile
                        </span>
                    {/if}
                </button>
            </div>
            {#each topButtons as button}
                <button
                    class="nav-button"
                    onmouseenter={() => setHoveredButton(button.id)}
                    onmouseleave={clearHoveredButton}
                    style=" text-align: center;"
                    type="button"
                    onclick={() => {
                        button.click();
                        toggleMenu();
                    }}
                >
                    <button.icon />
                    {#if hoveredButton === button.id && !isMobile}
                        <span class="button-label">
                            {button.label}
                        </span>
                    {/if}
                    {#if isMobile}
                        <span style="margin-left: 4px; font-size: 20px;">
                            {button.label}
                        </span>
                    {/if}
                </button>
            {/each}
        </div>
        <div class="d-flex flex-column align-items-center mb-3 w-100">
            <div class="language-settings">
                {#if isMobile}
                    <button
                        class="language nav-button"
                        type="button"
                        onmouseenter={() => {
                            setHoveredButton("Language");
                        }}
                        onmouseleave={() => {
                            clearHoveredButton();
                        }}
                        onkeydown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                toggleMenu();
                            }
                        }}
                        onclick={() => {
                            showLanguage = !showLanguage;
                        }}
                    >
                        <Globe />
                        <span style="margin-left: 4px; font-size: 20px; ">
                            Language
                        </span>
                        {#if showLanguage}
                            <div class="language-options">
                                <a
                                    class="language-options-button"
                                    href="/"
                                    type="button">English</a
                                >
                                <a
                                    class="language-options-button"
                                    href="/"
                                    type="button">Türkçe</a
                                >
                            </div>
                        {/if}
                    </button>
                {:else}
                    <button
                        class="language nav-button"
                        type="button"
                        onmouseenter={() => {
                            showLanguage = true;
                            setHoveredButton("Language");
                        }}
                        onmouseleave={() => {
                            showLanguage = false;
                            clearHoveredButton();
                        }}
                        onkeydown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                toggleMenu();
                            }
                        }}
                        onclick={() => toggleMenu()}
                    >
                        <Globe />
                        {#if showLanguage}
                            <div class="language-options">
                                <a
                                    class="language-options-button"
                                    href="/"
                                    type="button">English</a
                                >
                                <a
                                    class="language-options-button"
                                    href="/"
                                    type="button">Türkçe</a
                                >
                            </div>
                        {/if}
                    </button>
                {/if}
            </div>
            <button
                class="nav-button"
                onmouseenter={() => setHoveredButton("Settings")}
                onmouseleave={clearHoveredButton}
                onclick={() => toggleMenu()}
                type="button"
            >
                <Settings />
                {#if hoveredButton === "Settings"}
                    <span class="button-label">Settings</span>
                {/if}
                {#if isMobile}
                    <span style="margin-left: 4px; font-size: 20px; ">
                        Settings
                    </span>
                {/if}
            </button>
            {#if isMobile}
                <button class="nav-button" onclick={() => toggleMenu()}>
                    <CircleChevronLeft />
                    <span style="margin-left: 4px; font-size: 20px; ">
                        Back
                    </span>
                </button>
            {/if}
        </div>
    </div>
</nav>

{@render navPage()}

<style>
    .profile-image {
        width: 60px;
        height: 60px;
        cursor: pointer;
    }
    .profile-image:hover {
        filter: brightness(0.8);
    }
    .button-label {
        position: absolute;
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        background-color: rgba(24, 24, 37, 0.9);
        padding: 0.5rem;
        border: 1px solid #cba6f7;
        border-radius: 4px;
        white-space: nowrap;
        z-index: 10;
    }
    .nav-button {
        position: relative;
        display: flex;
        align-items: center;
        background: none;
        border: none;
        color: #cdd6f4;
        cursor: pointer;
        margin-top: 0.5rem;
        padding: 0.5rem;
        border-radius: 50%;
        transition: background-color 0.3s ease;
    }
    .nav-button:hover {
        filter: brightness(0.8);
    }
    .language-settings {
        margin-top: auto;
    }
    .language {
        position: relative;
        cursor: pointer;
    }
    .language-options {
        position: absolute;
        left: 100%;
        bottom: 0;
        background-color: rgba(24, 24, 37, 0.9);
        border: 1px solid #cba6f7;
        border-radius: 4px;
        padding: 0.5rem;
        z-index: 10;
    }
    .language-options-button {
        display: block;
        width: 100%;
        background: none;
        border: none;
        color: #cdd6f4;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        text-align: left;
        text-decoration: none;
    }

    .language-options-button:hover {
        background-color: rgba(203, 166, 247, 0.2);
    }
</style>
