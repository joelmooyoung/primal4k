import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Our Commitment to Your Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold mb-3">Information We Collect</h3>
                  <p className="text-muted-foreground">
                    This section will detail what information Primal4K Radio collects from listeners, 
                    including streaming data, contact forms, and chat interactions.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">How We Use Your Information</h3>
                  <p className="text-muted-foreground">
                    Information about how we use collected data to improve our service, 
                    communicate with listeners, and enhance the radio experience.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Data Protection</h3>
                  <p className="text-muted-foreground">
                    Details about our security measures and how we protect listener information.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Third-Party Services</h3>
                  <p className="text-muted-foreground">
                    Information about third-party services we use and how they may access data.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Your Rights</h3>
                  <p className="text-muted-foreground">
                    Details about listener rights regarding their personal data.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
                  <p className="text-muted-foreground">
                    If you have questions about this Privacy Policy, please contact us at privacy@primal4k.com
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;