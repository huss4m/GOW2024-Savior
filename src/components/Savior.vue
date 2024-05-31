<template>
  <div>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <div class="banner">
      <div class="logo-container">
        <img src="@/assets/saviorlogo.png" id="saviorlogo" />
        <img src="@/assets/olympiclogo.png" id="olympicLogo" />
      </div>
    </div>

    <canvas ref="canvas"></canvas>

    <footer class="footer">
      <p class="footer-text">Credits: First person weapon models by <a href="https://sketchfab.com/bumstrum" target="_blank" class="credit-link">3DMaesen (bumstrum)</a> under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" class="license-link">CC BY 4.0</a> (CC Attribution License).</p>
      <p class ="footer-text">Credit to <a href="https://www.FesliyanStudios.com" target="_blank" class="credit-link">FesliyanStudios</a> for the background music </p>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FirstPersonController } from '@/Savior/FirstPersonController';
import { MainMenu } from '@/Savior/MainMenu';

export default defineComponent({
  name: 'SaviorComponent',
  mounted() {
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    //new FirstPersonController(canvas);
    const mainMenu = new MainMenu(canvas);
  }
});
</script>

<style scoped>
  canvas {
    width: 70%;
    height: 70%;
    position: relative;
    margin-bottom: 20px; 
  }

  .banner {
    width: 100%;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.5); 
  }

  .logo-container {
    position: relative;
    display: inline-block;
  }

  #olympicLogo {
    width: 70%; 
    height: auto; 
    margin-top: 15%; 
  }

  #saviorlogo {
    width: 100%; 
    height: auto; 
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 6%;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.5);
    margin-top: 10px; 
    padding: 10px 0; 
  }

  .credit-link, .license-link {
    color: #0a4ca3; 
    text-decoration: none;
    font-weight: bold;
  }

  .credit-link:hover, .license-link:hover {
    text-decoration: underline;
  }

  .footer-text {
    font-size: 12px; 
  }
</style>
