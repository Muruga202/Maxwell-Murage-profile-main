const Footer = () => {
  return (
    <footer className="py-8 bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved. Built with passion and purpose.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Empowering through storytelling, education, and technology
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
